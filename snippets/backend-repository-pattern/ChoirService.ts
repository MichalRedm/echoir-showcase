import type { IChoirRepository, PopulatedChoirAggregate, ChoirDocument } from "./IChoirRepository.js";

export class HttpError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message);
    this.name = "HttpError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Requested choir resource not found") {
    super(message, 404);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "You do not have permission to perform this action in this choir") {
    super(message, 403);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Invalid choir operation parameters") {
    super(message, 400);
  }
}

/**
 * Choir Domain Service
 *
 * Encapsulates domain logic, workspace authorization rules, and data aggregation.
 * Completely decoupled from HTTP transport and native database drivers.
 */
export class ChoirService {
  constructor(private readonly choirRepo: IChoirRepository) {}

  /**
   * Loads a choir workspace with full repertoire and verifies user membership.
   *
   * @param choirId - Identifier of the choir workspace.
   * @param requestingUserId - Identifier of the authenticated user making the request.
   * @throws {NotFoundError} If the choir does not exist.
   * @throws {ForbiddenError} If the requesting user is not a member of the choir.
   */
  async getWorkspaceDetails(
    choirId: string,
    requestingUserId: string
  ): Promise<PopulatedChoirAggregate> {
    const choir = await this.choirRepo.getChoirDB(choirId);
    if (!choir) {
      throw new NotFoundError(`Choir with ID "${choirId}" was not found`);
    }

    const isMember = choir.users.some((u) => u.userId === requestingUserId);
    if (!isMember) {
      throw new ForbiddenError("You are not a registered member of this choir workspace");
    }

    return choir;
  }

  /**
   * Enrolls a user into a choir using a shareable invitation code.
   *
   * @param inviteCode - Alphanumeric invitation code.
   * @param userId - Enrolling user ID.
   */
  async joinChoirByInvite(inviteCode: string, userId: string): Promise<ChoirDocument> {
    const normalizedCode = inviteCode.trim().toLowerCase();
    const choir = await this.choirRepo.getChoirByInviteCodeDB(normalizedCode);
    
    if (!choir) {
      throw new NotFoundError("Invalid or expired choir invitation code");
    }

    // Check if user is already enrolled
    const alreadyMember = choir.users.some((u) => u.userId === userId);
    if (alreadyMember) {
      return choir; // Idempotent return
    }

    const updated = await this.choirRepo.addMemberToChoir(choir.choirId, userId, ["member"]);
    if (!updated) {
      throw new BadRequestError("Failed to enroll member into choir");
    }

    return updated;
  }

  /**
   * Validates whether a user has administrative privileges within a choir workspace.
   */
  async assertUserIsAdmin(choirId: string, userId: string): Promise<void> {
    const choir = await this.choirRepo.getChoirDB(choirId);
    if (!choir) {
      throw new NotFoundError();
    }

    const member = choir.users.find((u) => u.userId === userId);
    if (!member || !member.roles.includes("admin")) {
      throw new ForbiddenError("Administrator privileges required for this operation");
    }
  }
}
