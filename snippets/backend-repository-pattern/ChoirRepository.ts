import type { Collection, Db } from "mongodb";
import type {
  IChoirRepository,
  ChoirDocument,
  PopulatedChoirAggregate
} from "./IChoirRepository.js";

/**
 * Concrete MongoDB Implementation of ChoirRepository
 *
 * Encapsulates all MongoDB Native Driver operations, collection caching,
 * atomic updates, and aggregation queries for choir workspaces.
 */
export class MongoChoirRepository implements IChoirRepository {
  private collection: Collection<ChoirDocument> | null = null;

  constructor(private readonly getDatabase: () => Promise<Db>) {}

  /**
   * Lazily initializes and caches the MongoDB collection handle.
   */
  private async getCollection(): Promise<Collection<ChoirDocument>> {
    if (this.collection === null) {
      const db = await this.getDatabase();
      this.collection = db.collection<ChoirDocument>("choirs");
    }
    return this.collection;
  }

  /**
   * Retrieves a choir document and populates its associated songs and programmes.
   */
  async getChoirDB(choirId: string): Promise<PopulatedChoirAggregate | null> {
    const collection = await this.getCollection();
    const db = await this.getDatabase();

    const choirDocument = await collection.findOne({ choirId });
    if (!choirDocument) {
      return null;
    }

    // Parallel fetch for workspace children using indexed compound keys
    const [songs, programmes] = await Promise.all([
      db.collection("songs").find({ choirId }).toArray(),
      db.collection("programmes").find({ choirId }).toArray(),
    ]);

    return {
      ...choirDocument,
      songs: songs as any,
      programmes: programmes as any,
    };
  }

  /**
   * Retrieves all choir documents containing the specified user in their member roster.
   */
  async getChoirsByUserIdDB(userId: string): Promise<ChoirDocument[]> {
    const collection = await this.getCollection();
    return collection.find({ "users.userId": userId }).toArray();
  }

  /**
   * Atomically adds a user to the choir roster with collision prevention.
   */
  async addMemberToChoir(
    choirId: string,
    userId: string,
    roles: ("admin" | "moderator" | "member")[] = ["member"]
  ): Promise<ChoirDocument | null> {
    const collection = await this.getCollection();
    
    // Guard against duplicate membership at the database level
    return collection.findOneAndUpdate(
      { choirId, "users.userId": { $ne: userId } },
      {
        $push: {
          users: {
            userId,
            roles,
            joinTime: Date.now(),
          },
        },
        $set: { updateTime: Date.now() },
      },
      { returnDocument: "after" }
    );
  }

  /**
   * Inserts a new choir workspace document.
   */
  async createChoirDB(choir: ChoirDocument): Promise<ChoirDocument> {
    const collection = await this.getCollection();
    await collection.insertOne(choir);
    return choir;
  }

  /**
   * Resolves a choir workspace by its unique invite code.
   */
  async getChoirByInviteCodeDB(inviteCode: string): Promise<ChoirDocument | null> {
    const collection = await this.getCollection();
    return collection.findOne({ inviteCode });
  }

  /**
   * Updates partial metadata fields on a choir document.
   */
  async updateChoirDB(
    choirId: string,
    updates: Partial<Omit<ChoirDocument, "choirId">>
  ): Promise<ChoirDocument | null> {
    const collection = await this.getCollection();
    return collection.findOneAndUpdate(
      { choirId },
      {
        $set: {
          ...updates,
          updateTime: Date.now(),
        },
      },
      { returnDocument: "after" }
    );
  }

  /**
   * Deletes a choir workspace document.
   */
  async deleteChoirDB(choirId: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ choirId });
    return result.deletedCount === 1;
  }

  /**
   * Removes a user from all choir rosters across the database.
   */
  async removeMemberFromAllChoirsDB(userId: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateMany(
      { "users.userId": userId },
      {
        $pull: { users: { userId } },
        $set: { updateTime: Date.now() },
      }
    );
  }
}
