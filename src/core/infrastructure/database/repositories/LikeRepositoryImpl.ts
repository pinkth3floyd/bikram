import { eq, and, desc, count, or } from 'drizzle-orm';
import { LikeRepository } from '../../../domain/repositories/LikeRepository';
import { Like, LikeType, LikeReaction } from '../../../domain/entities/Like';
import { db, dbReadonly } from '../connection';
import { likes } from '../schema';

export class LikeRepositoryImpl implements LikeRepository {
  private readonly database = db;
  private readonly readonlyDatabase = dbReadonly || db;

  // Basic CRUD operations
  async findById(id: string): Promise<Like | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(likes)
        .where(eq(likes.id, id))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToLike(result[0]);
    } catch (error) {
      console.error('Error finding like by ID:', error);
      throw new Error('Failed to find like by ID');
    }
  }

  async create(like: Like): Promise<Like> {
    try {
      const likeData = {
        id: like.getId(),
        userId: like.getUserId(),
        targetId: like.getTargetId(),
        targetType: like.getTargetType(),
        reaction: like.getReaction(),
        createdAt: like.getCreatedAt()
      };

      await this.database.insert(likes).values(likeData);

      return like;
    } catch (error) {
      console.error('Error creating like:', error);
      throw new Error('Failed to create like');
    }
  }

  async update(like: Like): Promise<Like> {
    try {
      const likeData = {
        reaction: like.getReaction()
      };

      await this.database
        .update(likes)
        .set(likeData)
        .where(eq(likes.id, like.getId()));

      return like;
    } catch (error) {
      console.error('Error updating like:', error);
      throw new Error('Failed to update like');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database
        .delete(likes)
        .where(eq(likes.id, id));
    } catch (error) {
      console.error('Error deleting like:', error);
      throw new Error('Failed to delete like');
    }
  }

  // Query operations
  async findByUser(userId: string): Promise<Like[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(likes)
        .where(eq(likes.userId, userId))
        .orderBy(desc(likes.createdAt));

      return result.map(row => this.mapToLike(row));
    } catch (error) {
      console.error('Error finding likes by user:', error);
      throw new Error('Failed to find likes by user');
    }
  }

  async findByTarget(targetId: string, targetType: LikeType): Promise<Like[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(likes)
        .where(
          and(
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        )
        .orderBy(desc(likes.createdAt));

      return result.map(row => this.mapToLike(row));
    } catch (error) {
      console.error('Error finding likes by target:', error);
      throw new Error('Failed to find likes by target');
    }
  }

  async findByUserAndTarget(userId: string, targetId: string, targetType: LikeType): Promise<Like | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(likes)
        .where(
          and(
            eq(likes.userId, userId),
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        )
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToLike(result[0]);
    } catch (error) {
      console.error('Error finding like by user and target:', error);
      throw new Error('Failed to find like by user and target');
    }
  }

  async findByReaction(reaction: LikeReaction): Promise<Like[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(likes)
        .where(eq(likes.reaction, reaction))
        .orderBy(desc(likes.createdAt));

      return result.map(row => this.mapToLike(row));
    } catch (error) {
      console.error('Error finding likes by reaction:', error);
      throw new Error('Failed to find likes by reaction');
    }
  }

  // Statistics
  async getTotalLikes(): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(likes);

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting total likes:', error);
      throw new Error('Failed to get total likes');
    }
  }

  async getLikesByTarget(targetId: string, targetType: LikeType): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(likes)
        .where(
          and(
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        );

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting likes by target:', error);
      throw new Error('Failed to get likes by target');
    }
  }

  async getLikesByReaction(targetId: string, targetType: LikeType, reaction: LikeReaction): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(likes)
        .where(
          and(
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType),
            eq(likes.reaction, reaction)
          )
        );

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting likes by reaction:', error);
      throw new Error('Failed to get likes by reaction');
    }
  }

  async getReactionCounts(targetId: string, targetType: LikeType): Promise<Record<LikeReaction, number>> {
    try {
      const result = await this.readonlyDatabase
        .select({
          reaction: likes.reaction,
          count: count()
        })
        .from(likes)
        .where(
          and(
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        )
        .groupBy(likes.reaction);

      const reactionCounts: Record<LikeReaction, number> = {
        [LikeReaction.LIKE]: 0,
        [LikeReaction.LOVE]: 0,
        [LikeReaction.HAHA]: 0,
        [LikeReaction.WOW]: 0,
        [LikeReaction.SAD]: 0,
        [LikeReaction.ANGRY]: 0,
        [LikeReaction.CARE]: 0
      };

      result.forEach(row => {
        if (row.reaction in reactionCounts) {
          reactionCounts[row.reaction as LikeReaction] = row.count;
        }
      });

      return reactionCounts;
    } catch (error) {
      console.error('Error getting reaction counts:', error);
      throw new Error('Failed to get reaction counts');
    }
  }

  async isLikedByUser(userId: string, targetId: string, targetType: LikeType): Promise<boolean> {
    try {
      const like = await this.findByUserAndTarget(userId, targetId, targetType);
      return like !== null;
    } catch (error) {
      console.error('Error checking if liked by user:', error);
      throw new Error('Failed to check if liked by user');
    }
  }

  async getUserReaction(userId: string, targetId: string, targetType: LikeType): Promise<LikeReaction | null> {
    try {
      const like = await this.findByUserAndTarget(userId, targetId, targetType);
      return like ? like.getReaction() : null;
    } catch (error) {
      console.error('Error getting user reaction:', error);
      throw new Error('Failed to get user reaction');
    }
  }

  // Bulk operations
  async deleteByUserAndTarget(userId: string, targetId: string, targetType: LikeType): Promise<void> {
    try {
      await this.database
        .delete(likes)
        .where(
          and(
            eq(likes.userId, userId),
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        );
    } catch (error) {
      console.error('Error deleting like by user and target:', error);
      throw new Error('Failed to delete like by user and target');
    }
  }

  async deleteByTarget(targetId: string, targetType: LikeType): Promise<void> {
    try {
      await this.database
        .delete(likes)
        .where(
          and(
            eq(likes.targetId, targetId),
            eq(likes.targetType, targetType)
          )
        );
    } catch (error) {
      console.error('Error deleting likes by target:', error);
      throw new Error('Failed to delete likes by target');
    }
  }

  // Helper methods
  private mapToLike(row: Record<string, unknown>): Like {
    return new Like(
      row.id as string,
      row.userId as string,
      row.targetId as string,
      row.targetType as LikeType,
      row.reaction as LikeReaction,
      new Date(row.createdAt as number)
    );
  }
}
