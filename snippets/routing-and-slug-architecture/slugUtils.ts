/**
 * @fileoverview Sanitized production snippet demonstrating hybrid ID-slug routing,
 * multilingual diacritic transliteration, longest-prefix collision resistance,
 * and workspace-centric URL query parameter management.
 *
 * Pattern: Resilient Hybrid ID-Slug Routing & Multi-Pane State Architecture
 * Technology: TypeScript (Strict Mode, Zero-Any), React Router v6
 */

/**
 * Minimal structural interface for an entity in the songbook repertoire.
 */
export interface SongRouteEntity {
  readonly songId: string;
  readonly title: string;
}

/**
 * Minimal structural interface for a concert setlist / programme entity.
 */
export interface ProgrammeRouteEntity {
  readonly id?: string | number;
  readonly title?: string;
}

/**
 * Normalizes an arbitrary text title into a URL-safe, lowercase ASCII slug.
 *
 * Implements a high-performance mapping table for Central/Eastern European (Polish)
 * diacritic characters to preserve readability in chat previews and search engines.
 *
 * @param input - The raw human-readable title string.
 * @returns Clean hyphenated lowercase slug containing only `[a-z0-9-]`.
 *
 * @example
 * ```ts
 * slugify("Bóg się rodzi (opr. Nowowiejski)"); // "bog-sie-rodzi-opr-nowowiejski"
 * slugify("Ave Maria"); // "ave-maria"
 * ```
 */
export function slugify(input: string): string {
  if (!input) return "";

  const diacriticMap: Readonly<Record<string, string>> = {
    ą: "a", ć: "c", ę: "e", ł: "l", ń: "n",
    ó: "o", ś: "s", ź: "z", ż: "z",
    Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n",
    Ó: "o", Ś: "s", Ź: "z", Ż: "z",
  };

  let normalized = input.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char: string): string => {
    return diacriticMap[char] ?? char;
  });

  normalized = normalized.toLowerCase();
  normalized = normalized.replace(/[^a-z0-9]+/g, "-");
  normalized = normalized.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

  return normalized;
}

/**
 * Formats a hybrid song slug combining the immutable database `songId`
 * with a human-readable transliterated title.
 *
 * @param song - Object containing immutable `songId` and human-readable `title`.
 * @returns Formatted slug string such as `"s481-bog-sie-rodzi"`.
 */
export function getSongSlug(song: SongRouteEntity): string {
  const cleanSlug = slugify(song.title);
  return cleanSlug ? `${song.songId}-${cleanSlug}` : song.songId;
}

/**
 * Extracts and resolves the raw `songId` from a hybrid path parameter.
 *
 * Resolution Strategy:
 * 1. Direct Equality: Matches raw `songId` without slug suffix.
 * 2. Longest-Prefix Match: Sorts candidates by `songId.length` descending to prevent
 *    shorter ID prefixes from shadowing longer identifiers (e.g. `s1` vs `s12`).
 * 3. Fallback: Extracts substring prior to first hyphen when repertoire cache is hydrating.
 *
 * @param param - Raw URL slug parameter (e.g. `"s481-bog-sie-rodzi"` or `"s481"`).
 * @param songs - Optional loaded repertoire array for authoritative resolution.
 * @returns Resolved immutable database `songId`, or `null` if parameter is undefined.
 */
export function extractSongId(
  param: string | undefined,
  songs?: readonly SongRouteEntity[]
): string | null {
  if (!param) return null;

  if (songs && songs.length > 0) {
    // 1. Direct equality with known identifier
    const directMatch = songs.find((s) => s.songId === param);
    if (directMatch) return directMatch.songId;

    // 2. Prefix match sorted by identifier length descending
    const prefixMatch = [...songs]
      .sort((a, b) => b.songId.length - a.songId.length)
      .find((s) => param.startsWith(`${s.songId}-`));
    if (prefixMatch) return prefixMatch.songId;

    // 3. Known entity candidate lookup via prefix substring
    const dashIdx = param.indexOf("-");
    if (dashIdx !== -1) {
      const candidateId = param.substring(0, dashIdx);
      const candidateMatch = songs.find((s) => s.songId === candidateId);
      if (candidateMatch) return candidateMatch.songId;
    }
  }

  // Fallback when repertoire is not yet loaded in memory
  const fallbackDashIdx = param.indexOf("-");
  return fallbackDashIdx !== -1 ? param.substring(0, fallbackDashIdx) : param;
}

/**
 * Formats a hybrid programme slug combining the database `id` with a slugified title.
 *
 * @param programme - Object containing optional numeric or string `id` and `title`.
 * @returns Combined ID-slug string, or empty string if id is undefined.
 *
 * @example
 * ```ts
 * getProgrammeSlug({ id: 12, title: "Koncert Wielkopostny" }); // "12-koncert-wielkopostny"
 * getProgrammeSlug({ id: "p10", title: "" }); // "p10"
 * ```
 */
export function getProgrammeSlug(programme: ProgrammeRouteEntity): string {
  if (programme.id === undefined || programme.id === null) return "";
  const rawId = String(programme.id);
  const slug = slugify(programme.title ?? "");
  return slug ? `${rawId}-${slug}` : rawId;
}

/**
 * Constructs the canonical route path for opening a programme in the choir workspace.
 *
 * Demonstrates the workspace-centric routing paradigm: the primary workspace path
 * remains `/choir/:choirId/songs`, while the contextual programme workbench state is
 * mounted via query parameters (`?programme=...`), keeping the multi-pane workbench intact.
 *
 * @param choirId - Identifier of the active choir workspace.
 * @param programme - Target programme object or `"new"` for draft creation.
 * @returns Complete canonical URI with query parameter.
 */
export function getProgrammePath(
  choirId: string,
  programme?: ProgrammeRouteEntity | "new"
): string {
  if (programme === "new" || !programme || programme.id === undefined || programme.id === null) {
    return `/choir/${choirId}/songs?programme=new`;
  }
  return `/choir/${choirId}/songs?programme=${getProgrammeSlug(programme)}`;
}

/**
 * Extracts and resolves the raw `programmeId` from an ID-slug hybrid URL query parameter.
 *
 * Features:
 * - Explicitly preserves `"new"` for draft programme states.
 * - Handles both numeric and string IDs transparently.
 * - Prevents prefix collision via descending length sorting.
 *
 * @param param - The route or search parameter string (e.g. `"12-koncert-wielkopostny"` or `"12"`).
 * @param programmes - Optional array of loaded programmes in the choir context.
 * @returns Resolved raw `programmeId` string, or `null` if parameter is undefined.
 */
export function extractProgrammeId(
  param: string | undefined,
  programmes?: readonly ProgrammeRouteEntity[]
): string | null {
  if (!param) return null;
  if (param === "new") return "new";

  if (programmes && programmes.length > 0) {
    // 1. Direct match on String(p.id)
    const directMatch = programmes.find(
      (p) => p.id !== undefined && String(p.id) === param
    );
    if (directMatch && directMatch.id !== undefined) {
      return String(directMatch.id);
    }

    // 2. Prefix match for `${String(p.id)}-` with descending length sort
    const prefixMatch = [...programmes]
      .filter((p) => p.id !== undefined && p.id !== null)
      .sort((a, b) => String(b.id).length - String(a.id).length)
      .find((p) => param.startsWith(`${String(p.id)}-`));
    if (prefixMatch && prefixMatch.id !== undefined) {
      return String(prefixMatch.id);
    }

    // 3. Fallback: candidate before first hyphen validated against known list
    const firstDashIndex = param.indexOf("-");
    if (firstDashIndex !== -1) {
      const candidateId = param.substring(0, firstDashIndex);
      const candidateMatch = programmes.find(
        (p) => p.id !== undefined && String(p.id) === candidateId
      );
      if (candidateMatch && candidateMatch.id !== undefined) {
        return String(candidateMatch.id);
      }
    }
  }

  // Fallback when programmes list is still hydrating
  const dashIdx = param.indexOf("-");
  return dashIdx !== -1 ? param.substring(0, dashIdx) : param;
}
