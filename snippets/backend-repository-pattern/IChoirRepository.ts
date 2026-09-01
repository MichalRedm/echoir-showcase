/**
 * Choir Repository Interface Contract
 * 
 * Defines the strict database boundaries for choir workspace persistence,
 * member associations, and multi-tenant repertoire aggregations.
 *
 * @remarks
 * Adheres to the Dependency Inversion Principle: domain services depend exclusively
 * on this abstraction, ensuring zero coupling with the underlying MongoDB driver.
 */

export interface ChoirMember {
  userId: string;
  roles: ("admin" | "moderator" | "member")[];
  joinTime: number;
}

export interface ChoirDocument {
  choirId: string;
  name: string;
  description?: string;
  location?: string;
  avatarUrl?: string;
  inviteCode: string;
  users: ChoirMember[];
  createTime: number;
  updateTime: number;
}

export interface PopulatedChoirAggregate extends ChoirDocument {
  songs: Array<{
    songId: string;
    title: string;
    composer?: string;
    labels: string[];
    voicing?: string;
  }>;
  programmes: Array<{
    programmeId: string;
    title: string;
    songs: Array<{ songId: string; orderIndex: number }>;
  }>;
}

export interface IChoirRepository {
  /**
   * Retrieves a choir workspace by its unique domain identifier, aggregating
   * all related repertoire songs and concert programmes in a single query.
   */
  getChoirDB(choirId: string): Promise<PopulatedChoirAggregate | null>;

  /**
   * Retrieves all choir workspaces that a user belongs to across the entire platform.
   */
  getChoirsByUserIdDB(userId: string): Promise<ChoirDocument[]>;

  /**
   * Enrolls a user into a choir workspace if they are not already joined.
   * Performs an atomic `$push` with a `$ne` collision guard.
   */
  addMemberToChoir(choirId: string, userId: string, roles?: string[]): Promise<ChoirDocument | null>;

  /**
   * Creates and persists a brand-new choir workspace document.
   */
  createChoirDB(choir: ChoirDocument): Promise<ChoirDocument>;

  /**
   * Retrieves a choir workspace by its shareable 8-character invitation code.
   */
  getChoirByInviteCodeDB(inviteCode: string): Promise<ChoirDocument | null>;

  /**
   * Applies partial updates to a choir's settings, name, or metadata.
   */
  updateChoirDB(choirId: string, updates: Partial<Omit<ChoirDocument, "choirId">>): Promise<ChoirDocument | null>;

  /**
   * Permanently deletes a choir workspace and cascades cleanup across associations.
   */
  deleteChoirDB(choirId: string): Promise<boolean>;

  /**
   * Removes a user from all choirs across the system (invoked during account scrubbing).
   */
  removeMemberFromAllChoirsDB(userId: string): Promise<void>;
}

export default IChoirRepository;
