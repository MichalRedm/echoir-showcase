import crypto from "crypto";

export interface InvitePreviewMetadata {
  choirId: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  memberCount: number;
}

/**
 * Character set excluding easily confused glyphs (0/O, 1/I/l).
 */
const UNAMBIGUOUS_CHARSET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";

/**
 * Invitation Security & Code Generation Engine
 *
 * Provides cryptographic token generation, unambiguous charset mapping,
 * and safe public metadata resolution for choir member onboarding.
 */
export class InvitationService {
  /**
   * Generates a high-entropy, 8-character invitation code.
   *
   * Uses cryptographically secure random bytes to prevent enumeration attacks.
   */
  static generateSecureInviteCode(length = 8): string {
    const bytes = crypto.randomBytes(length);
    let result = "";
    const charsetLength = UNAMBIGUOUS_CHARSET.length;

    for (let i = 0; i < length; i++) {
      result += UNAMBIGUOUS_CHARSET[bytes[i] % charsetLength];
    }

    return result;
  }

  /**
   * Normalizes user-entered invitation codes (case-insensitive and trimmed).
   */
  static normalizeInviteCode(input: string): string {
    return input.trim().toLowerCase();
  }

  /**
   * Sanitizes a choir workspace document into safe public preview metadata
   * for unauthenticated or prospective members viewing `/join/:code`.
   */
  static formatPublicPreview(choirDoc: {
    choirId: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    users: Array<unknown>;
  }): InvitePreviewMetadata {
    return {
      choirId: choirDoc.choirId,
      name: choirDoc.name,
      description: choirDoc.description,
      avatarUrl: choirDoc.avatarUrl,
      memberCount: choirDoc.users.length,
    };
  }
}

export default InvitationService;
