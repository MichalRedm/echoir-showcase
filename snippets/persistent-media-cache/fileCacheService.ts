/**
 * @fileoverview Sanitized production snippet demonstrating a client-side persistent media cache
 * engine with deterministic version validation, in-flight request deduplication, and dual-watermark LRU eviction.
 *
 * Pattern: Multi-Tier Persistent Binary Cache & Storage Quota Management
 * Technology: TypeScript (Strict Mode, Zero-Any), IndexedDB, Web APIs
 */

import {
  acquireObjectUrl,
  releaseObjectUrl,
  revokeObjectUrl,
  revokeAllObjectUrls,
} from "./objectUrlManager";

/** Supported media binary categories in persistent storage. */
export type MediaType = "image" | "audio";

/**
 * Persisted schema record stored in IndexedDB for score pages and vocal rehearsal stems.
 */
export interface CachedMediaRecord {
  /** Unique primary key (e.g. `image:s481:0` or `audio:s481:soprano`). */
  readonly id: string;
  /** Remote REST API endpoint origin. */
  readonly url: string;
  /** Raw binary data payload. */
  readonly blob: Blob;
  /** MIME type (e.g. `image/webp` or `audio/mpeg`). */
  readonly mimeType: string;
  /** Byte length of binary payload. */
  readonly size: number;
  /**
   * Authoritative entity update timestamp (`Song.updateTime` or `Recording.updateTime`).
   * Powers deterministic O(1) cache validation with zero network roundtrips.
   */
  readonly version: number;
  /** Unique identifier of parent song. */
  readonly songId: string;
  /** Optional choir workspace identifier for scoped purges. */
  readonly choirId?: string;
  /** Media discriminator. */
  readonly mediaType: MediaType;
  /** Unix timestamp in milliseconds when entry was last accessed, driving LRU order. */
  lastAccessedAt: number;
  /** Unix timestamp when entry was first written. */
  readonly cachedAt: number;
}

/**
 * Parameter payload passed to cache access methods.
 */
export interface GetMediaOptions {
  readonly songId: string;
  readonly type: MediaType;
  readonly itemIdentifier: number | string;
  readonly version: number;
  readonly fallbackUrl: string;
  readonly choirId?: string;
}

/**
 * Aggregated storage usage statistics for UI diagnostics and settings.
 */
export interface CacheStats {
  readonly totalBytes: number;
  readonly imageBytes: number;
  readonly audioBytes: number;
  readonly totalCount: number;
  readonly imageCount: number;
  readonly audioCount: number;
}

/**
 * Storage quota limits and watermark thresholds governing automatic LRU eviction.
 */
export interface CacheStorageConfig {
  /** Hard storage quota in bytes (default: 250 MB). */
  readonly maxSizeBytes: number;
  /** High watermark ratio triggering LRU pruning (e.g. 0.90 for 90%). */
  readonly highWatermarkRatio: number;
  /** Low watermark ratio to which pruning reduces storage (e.g. 0.70 for 70%). */
  readonly lowWatermarkRatio: number;
  /** Maximum inactivity duration before eviction (e.g. 30 days). */
  readonly maxAgeMs: number;
}

export const DEFAULT_CACHE_CONFIG: CacheStorageConfig = {
  maxSizeBytes: 250 * 1024 * 1024,
  highWatermarkRatio: 0.9,
  lowWatermarkRatio: 0.7,
  maxAgeMs: 30 * 24 * 60 * 60 * 1000,
};

/** In-flight request deduplication map preventing concurrent duplicate downloads. */
const inFlightDownloads = new Map<string, Promise<Blob>>();

/**
 * Constructs a deterministic composite key for storage indexing.
 */
export function createCacheKey(
  type: MediaType,
  songId: string,
  itemIdentifier: string | number
): string {
  return `${type}:${songId}:${String(itemIdentifier).toLowerCase()}`;
}

/**
 * Interface abstracting IndexedDB low-level operations for testing and platform decoupling.
 */
export interface IIndexedDBStorageAdapter {
  get(key: string): Promise<CachedMediaRecord | null>;
  put(record: CachedMediaRecord): Promise<void>;
  delete(key: string): Promise<void>;
  deleteBySongId(songId: string): Promise<readonly string[]>;
  deleteByChoirId(choirId: string): Promise<readonly string[]>;
  getAll(): Promise<readonly CachedMediaRecord[]>;
  getOldestFirst(): Promise<readonly CachedMediaRecord[]>;
  updateLastAccessed(key: string): Promise<void>;
  clear(): Promise<void>;
  isSupported(): boolean;
}

/**
 * Core persistent media caching engine.
 */
export class FileCacheService {
  private readonly db: IIndexedDBStorageAdapter;
  private readonly config: CacheStorageConfig;
  private isPruning = false;

  constructor(
    dbAdapter: IIndexedDBStorageAdapter,
    config: CacheStorageConfig = DEFAULT_CACHE_CONFIG
  ) {
    this.db = dbAdapter;
    this.config = config;
  }

  /**
   * Retrieves the raw binary `Blob` for a media resource from persistent storage or network fallback.
   *
   * Deterministic Freshness Check:
   * Compares `record.version` with `options.version`. If equal, returns the cached blob instantly (0 network roundtrips).
   * If stale or missing, downloads from `options.fallbackUrl` with in-flight deduplication, writes to IndexedDB,
   * and schedules background LRU checks.
   */
  public async getMediaBlob(
    options: GetMediaOptions
  ): Promise<{ blob: Blob; fromCache: boolean }> {
    const key = createCacheKey(options.type, options.songId, options.itemIdentifier);

    if (this.db.isSupported()) {
      try {
        const cached = await this.db.get(key);
        if (cached && cached.version === options.version) {
          // Asynchronously touch lastAccessedAt for LRU order
          this.db.updateLastAccessed(key).catch(() => {});
          return { blob: cached.blob, fromCache: true };
        }
      } catch (err: unknown) {
        console.warn("[FileCacheService] IndexedDB read error:", err);
      }
    }

    // Cache miss or outdated version: download with in-flight promise deduplication
    const blob = await this.fetchWithDeduplication(key, options.fallbackUrl);

    if (this.db.isSupported()) {
      const record: CachedMediaRecord = {
        id: key,
        url: options.fallbackUrl,
        blob,
        mimeType: blob.type || (options.type === "image" ? "image/webp" : "audio/mpeg"),
        size: blob.size,
        version: options.version,
        songId: options.songId,
        choirId: options.choirId,
        mediaType: options.type,
        lastAccessedAt: Date.now(),
        cachedAt: Date.now(),
      };

      this.db
        .put(record)
        .then(() => this.schedulePruneCheck())
        .catch((err: unknown) => {
          console.warn("[FileCacheService] IndexedDB write error:", err);
        });
    }

    return { blob, fromCache: false };
  }

  /**
   * Retrieves an active browser Object URL for a media resource, registering it with `objectUrlManager`.
   */
  public async getMediaUrl(
    options: GetMediaOptions
  ): Promise<{ url: string; fromCache: boolean }> {
    const key = createCacheKey(options.type, options.songId, options.itemIdentifier);
    const { blob, fromCache } = await this.getMediaBlob(options);
    const url = acquireObjectUrl(key, blob);
    return { url, fromCache };
  }

  /**
   * Releases a subscriber reference for a media resource from the Object URL manager.
   */
  public releaseMediaUrl(
    type: MediaType,
    songId: string,
    itemIdentifier: string | number
  ): void {
    const key = createCacheKey(type, songId, itemIdentifier);
    releaseObjectUrl(key);
  }

  /**
   * Permanently purges all cached score pages and audio stems for a deleted or modified song.
   */
  public async invalidateSong(songId: string): Promise<void> {
    if (!this.db.isSupported()) return;
    try {
      const deletedKeys = await this.db.deleteBySongId(songId);
      deletedKeys.forEach((key) => revokeObjectUrl(key));
    } catch (err: unknown) {
      console.error(`[FileCacheService] Error invalidating song ${songId}:`, err);
    }
  }

  /**
   * Permanently purges all cached assets belonging to a specific choir workspace.
   */
  public async invalidateChoir(choirId: string): Promise<void> {
    if (!this.db.isSupported()) return;
    try {
      const deletedKeys = await this.db.deleteByChoirId(choirId);
      deletedKeys.forEach((key) => revokeObjectUrl(key));
    } catch (err: unknown) {
      console.error(`[FileCacheService] Error invalidating choir ${choirId}:`, err);
    }
  }

  /**
   * Computes aggregated storage consumption across image and audio caches.
   */
  public async getStorageStats(): Promise<CacheStats> {
    if (!this.db.isSupported()) {
      return { totalBytes: 0, imageBytes: 0, audioBytes: 0, totalCount: 0, imageCount: 0, audioCount: 0 };
    }

    const records = await this.db.getAll();
    let imageBytes = 0;
    let audioBytes = 0;
    let imageCount = 0;
    let audioCount = 0;

    for (const r of records) {
      if (r.mediaType === "image") {
        imageBytes += r.size;
        imageCount += 1;
      } else {
        audioBytes += r.size;
        audioCount += 1;
      }
    }

    return {
      totalBytes: imageBytes + audioBytes,
      imageBytes,
      audioBytes,
      totalCount: records.length,
      imageCount,
      audioCount,
    };
  }

  /**
   * Clears the entire offline storage and revokes all active Object URLs.
   */
  public async clearAll(): Promise<void> {
    revokeAllObjectUrls();
    if (this.db.isSupported()) {
      await this.db.clear();
    }
  }

  /**
   * In-flight deduplicated download wrapper.
   */
  private async fetchWithDeduplication(key: string, url: string): Promise<Blob> {
    const active = inFlightDownloads.get(key);
    if (active) return active;

    const download = (async (): Promise<Blob> => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed fetching binary asset`);
        }
        return await res.blob();
      } finally {
        inFlightDownloads.delete(key);
      }
    })();

    inFlightDownloads.set(key, download);
    return download;
  }

  /**
   * Checks current storage usage against high watermark and prunes least-recently-used
   * items down to the low watermark threshold.
   */
  private async schedulePruneCheck(): Promise<void> {
    if (this.isPruning || !this.db.isSupported()) return;
    this.isPruning = true;

    try {
      const stats = await this.getStorageStats();
      const highWatermarkBytes = this.config.maxSizeBytes * this.config.highWatermarkRatio;

      if (stats.totalBytes <= highWatermarkBytes) {
        return;
      }

      const targetBytes = this.config.maxSizeBytes * this.config.lowWatermarkRatio;
      let currentBytes = stats.totalBytes;
      const candidates = await this.db.getOldestFirst();

      for (const record of candidates) {
        if (currentBytes <= targetBytes) break;
        await this.db.delete(record.id);
        revokeObjectUrl(record.id);
        currentBytes -= record.size;
      }
    } catch (err: unknown) {
      console.warn("[FileCacheService] Error during LRU pruning:", err);
    } finally {
      this.isPruning = false;
    }
  }
}
