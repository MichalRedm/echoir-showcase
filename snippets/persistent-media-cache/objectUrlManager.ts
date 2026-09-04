/**
 * @fileoverview Sanitized production snippet demonstrating memory-safe browser Object URL
 * reference counting, deferred garbage collection, and browser heap leak prevention.
 *
 * Pattern: Reference-Counted Object URL Lifecycle Manager
 * Technology: TypeScript (Strict Mode, Zero-Any), Browser Web APIs
 */

/**
 * Internal tracking descriptor for an active browser Object URL.
 */
interface ObjectUrlEntry {
  /** The generated `blob:...` URL string assigned by the browser runtime. */
  readonly url: string;
  /** Active subscriber count currently referencing this Object URL. */
  refCount: number;
  /** Deferred cleanup timer scheduled to revoke the URL once all subscribers detach. */
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

/**
 * In-memory registry mapping cache entry keys (e.g. `img:s481:0`) to their active Object URL descriptors.
 */
const registry = new Map<string, ObjectUrlEntry>();

/**
 * Grace period (in milliseconds) before revoking an unreferenced Object URL.
 *
 * Prevents visual image flickering and audio buffer stalls caused by rapid
 * component unmount/remount cycles (e.g. React 18 StrictMode double-mounting or fast slide swiping).
 */
const REVOCATION_GRACE_PERIOD_MS = 3000;

/**
 * Acquires a memory-safe browser Object URL for a given binary `Blob`.
 *
 * Reuses existing allocated URLs for the same cache key by incrementing the reference count.
 * If an entry was pending deferred garbage collection, its timer is cancelled and the existing
 * URL is returned immediately with zero memory re-allocation.
 *
 * @param cacheKey - Unique deterministic cache entry identifier (e.g. `image:s481:0`).
 * @param blob - Binary data blob retrieved from IndexedDB or network download.
 * @returns Standard browser `blob:...` URL string.
 */
export function acquireObjectUrl(cacheKey: string, blob: Blob): string {
  if (typeof window === "undefined" || typeof URL === "undefined") {
    return "";
  }

  const existing = registry.get(cacheKey);

  if (existing) {
    if (existing.cleanupTimer !== undefined) {
      clearTimeout(existing.cleanupTimer);
      existing.cleanupTimer = undefined;
    }
    existing.refCount += 1;
    return existing.url;
  }

  const url = URL.createObjectURL(blob);
  registry.set(cacheKey, { url, refCount: 1 });
  return url;
}

/**
 * Releases a subscriber reference from an active Object URL.
 *
 * Decrements the active reference counter. When the count drops to zero, schedules a deferred
 * revocation timer to release the underlying binary blob from browser heap memory.
 *
 * @param cacheKey - Unique cache entry identifier to release.
 */
export function releaseObjectUrl(cacheKey: string): void {
  const entry = registry.get(cacheKey);
  if (!entry) return;

  entry.refCount -= 1;

  if (entry.refCount <= 0) {
    if (entry.cleanupTimer !== undefined) {
      clearTimeout(entry.cleanupTimer);
    }

    entry.cleanupTimer = setTimeout((): void => {
      URL.revokeObjectURL(entry.url);
      registry.delete(cacheKey);
    }, REVOCATION_GRACE_PERIOD_MS);
  }
}

/**
 * Immediately revokes an Object URL for a specific cache key and purges it from the registry.
 *
 * Bypasses the deferred grace period. Useful during explicit cache purges or song deletions.
 *
 * @param cacheKey - Unique cache entry identifier to revoke.
 */
export function revokeObjectUrl(cacheKey: string): void {
  const entry = registry.get(cacheKey);
  if (!entry) return;

  if (entry.cleanupTimer !== undefined) {
    clearTimeout(entry.cleanupTimer);
  }
  URL.revokeObjectURL(entry.url);
  registry.delete(cacheKey);
}

/**
 * Synchronously retrieves the currently active Object URL for a cache key, if one is allocated.
 *
 * @param cacheKey - Unique cache entry identifier.
 * @returns Active `blob:...` URL string or `null` if none is currently tracked.
 */
export function getActiveObjectUrl(cacheKey: string): string | null {
  return registry.get(cacheKey)?.url ?? null;
}

/**
 * Revokes all tracked Object URLs held in memory and resets the registry.
 *
 * Call during user logout, workspace switching, or emergency memory cleanup.
 */
export function revokeAllObjectUrls(): void {
  for (const entry of registry.values()) {
    if (entry.cleanupTimer !== undefined) {
      clearTimeout(entry.cleanupTimer);
    }
    URL.revokeObjectURL(entry.url);
  }
  registry.clear();
}
