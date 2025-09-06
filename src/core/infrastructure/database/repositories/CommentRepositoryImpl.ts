import { eq, like, and, desc, asc, count, sql } from 'drizzle-orm';
import { CommentRepository } from '../../../domain/repositories/CommentRepository';
import { Comment, CommentStatus, CommentContent, CommentStats, CommentMetadata } from '../../../domain/entities/Comment';
import { db, dbReadonly } from '../connection';
import { comments } from '../schema';

export class CommentRepositoryImpl implements CommentRepository {
  private readonly database = db;
  private readonly readonlyDatabase = dbReadonly || db;

  // Basic CRUD operations
  async findById(id: string): Promise<Comment | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(eq(comments.id, id))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToComment(result[0]);
    } catch (error) {
      console.error('Error finding comment by ID:', error);
      throw new Error('Failed to find comment by ID');
    }
  }

  async create(comment: Comment): Promise<Comment> {
    try {
      const commentData = {
        id: comment.getId(),
        postId: comment.getPostId(),
        authorId: comment.getAuthorId(),
        parentId: comment.getParentId(),
        content: JSON.stringify(comment.getContent()),
        status: comment.getStatus(),
        likesCount: comment.getStats().likesCount,
        repliesCount: comment.getStats().repliesCount,
        reportsCount: comment.getStats().reportsCount,
        metadata: JSON.stringify(comment.getMetadata()),
        createdAt: comment.getCreatedAt(),
        updatedAt: comment.getUpdatedAt()
      };

      await this.database.insert(comments).values(commentData);

      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  async update(comment: Comment): Promise<Comment> {
    try {
      const commentData = {
        content: JSON.stringify(comment.getContent()),
        status: comment.getStatus(),
        likesCount: comment.getStats().likesCount,
        repliesCount: comment.getStats().repliesCount,
        reportsCount: comment.getStats().reportsCount,
        metadata: JSON.stringify(comment.getMetadata()),
        updatedAt: new Date()
      };

      await this.database
        .update(comments)
        .set(commentData)
        .where(eq(comments.id, comment.getId()));

      return comment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database
        .delete(comments)
        .where(eq(comments.id, id));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }

  // Query operations
  async findByPost(postId: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        )
        .orderBy(asc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding comments by post:', error);
      throw new Error('Failed to find comments by post');
    }
  }

  async findByAuthor(authorId: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(eq(comments.authorId, authorId))
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding comments by author:', error);
      throw new Error('Failed to find comments by author');
    }
  }

  async findReplies(parentId: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            eq(comments.parentId, parentId),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        )
        .orderBy(asc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding comment replies:', error);
      throw new Error('Failed to find comment replies');
    }
  }

  async findTopLevelComments(postId: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            eq(comments.status, CommentStatus.ACTIVE),
            sql`${comments.parentId} IS NULL`
          )
        )
        .orderBy(asc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding top level comments:', error);
      throw new Error('Failed to find top level comments');
    }
  }

  // Pagination
  async findWithPagination(page: number, limit: number): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.status, CommentStatus.ACTIVE));

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Get comments
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(eq(comments.status, CommentStatus.ACTIVE))
        .orderBy(asc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      const commentEntities = result.map(row => this.mapToComment(row));

      return {
        comments: commentEntities,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error finding comments with pagination:', error);
      throw new Error('Failed to find comments with pagination');
    }
  }

  async findByPostWithPagination(postId: string, page: number, limit: number): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count for this post
      const totalResult = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        );

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Get paginated comments for this post
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        )
        .orderBy(asc(comments.createdAt))
        .limit(limit)
        .offset(offset);

      const commentEntities = result.map(row => this.mapToComment(row));

      return {
        comments: commentEntities,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error finding comments by post with pagination:', error);
      throw new Error('Failed to find comments by post with pagination');
    }
  }

  // Statistics
  async getTotalComments(): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments);

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting total comments:', error);
      throw new Error('Failed to get total comments');
    }
  }

  async getCommentsByPost(postId: string): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(
          and(
            eq(comments.postId, postId),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        );

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting comments by post:', error);
      throw new Error('Failed to get comments by post');
    }
  }

  // Moderation
  async findPendingModeration(): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(like(comments.metadata, '%"moderationStatus":"pending"%'))
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding pending moderation comments:', error);
      throw new Error('Failed to find pending moderation comments');
    }
  }

  async findFlaggedComments(): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(like(comments.metadata, '%"moderationStatus":"flagged"%'))
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding flagged comments:', error);
      throw new Error('Failed to find flagged comments');
    }
  }

  async findByStatus(status: CommentStatus): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(eq(comments.status, status))
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error finding comments by status:', error);
      throw new Error('Failed to find comments by status');
    }
  }

  async getCommentThread(commentId: string): Promise<Comment[]> {
    try {
      // Get the main comment and all its replies recursively
      const mainComment = await this.findById(commentId);
      if (!mainComment) {
        return [];
      }

      const allComments = [mainComment];
      const replies = await this.findReplies(commentId);
      
      // Recursively get replies of replies
      for (const reply of replies) {
        const nestedReplies = await this.getCommentThread(reply.getId());
        allComments.push(...nestedReplies);
      }

      return allComments;
    } catch (error) {
      console.error('Error getting comment thread:', error);
      throw new Error('Failed to get comment thread');
    }
  }

  async getCommentReplies(commentId: string): Promise<Comment[]> {
    try {
      return await this.findReplies(commentId);
    } catch (error) {
      console.error('Error getting comment replies:', error);
      throw new Error('Failed to get comment replies');
    }
  }

  async searchComments(query: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            like(comments.content, `%${query}%`),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        )
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error searching comments:', error);
      throw new Error('Failed to search comments');
    }
  }

  async searchByMention(userId: string): Promise<Comment[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(comments)
        .where(
          and(
            like(comments.content, `%@${userId}%`),
            eq(comments.status, CommentStatus.ACTIVE)
          )
        )
        .orderBy(desc(comments.createdAt));

      return result.map(row => this.mapToComment(row));
    } catch (error) {
      console.error('Error searching comments by mention:', error);
      throw new Error('Failed to search comments by mention');
    }
  }

  async getCommentsByStatus(): Promise<Record<CommentStatus, number>> {
    try {
      const activeCount = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.status, CommentStatus.ACTIVE));

      const deletedCount = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.status, CommentStatus.DELETED));

      const hiddenCount = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.status, CommentStatus.HIDDEN));

      const moderatedCount = await this.readonlyDatabase
        .select({ count: count() })
        .from(comments)
        .where(eq(comments.status, CommentStatus.MODERATED));

      return {
        [CommentStatus.ACTIVE]: activeCount[0]?.count || 0,
        [CommentStatus.DELETED]: deletedCount[0]?.count || 0,
        [CommentStatus.HIDDEN]: hiddenCount[0]?.count || 0,
        [CommentStatus.MODERATED]: moderatedCount[0]?.count || 0
      };
    } catch (error) {
      console.error('Error getting comments by status:', error);
      throw new Error('Failed to get comments by status');
    }
  }

  async getCommentCountForPost(postId: string): Promise<number> {
    try {
      return await this.getCommentsByPost(postId);
    } catch (error) {
      console.error('Error getting comment count for post:', error);
      throw new Error('Failed to get comment count for post');
    }
  }

  async updateMany(ids: string[], _updates: Partial<Comment>): Promise<void> {
    try {
      // This is a simplified implementation
      // In a real scenario, you'd need to handle the partial updates properly
      for (const id of ids) {
        const comment = await this.findById(id);
        if (comment) {
          // Apply updates to the comment entity
          // This would need proper implementation based on what fields can be updated
          await this.update(comment);
        }
      }
    } catch (error) {
      console.error('Error updating many comments:', error);
      throw new Error('Failed to update many comments');
    }
  }

  async deleteMany(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        await this.delete(id);
      }
    } catch (error) {
      console.error('Error deleting many comments:', error);
      throw new Error('Failed to delete many comments');
    }
  }

  async getCommentsByUser(userId: string): Promise<Comment[]> {
    try {
      return await this.findByAuthor(userId);
    } catch (error) {
      console.error('Error getting comments by user:', error);
      throw new Error('Failed to get comments by user');
    }
  }

  async getCommentsForUserProfile(userId: string, _viewerId: string): Promise<Comment[]> {
    try {
      // For now, just return all comments by the user
      // In a real implementation, you might want to filter based on privacy settings
      return await this.findByAuthor(userId);
    } catch (error) {
      console.error('Error getting comments for user profile:', error);
      throw new Error('Failed to get comments for user profile');
    }
  }

  // Helper methods
  private mapToComment(row: Record<string, unknown>): Comment {
    const content: CommentContent = JSON.parse(row.content as string);
    const stats: CommentStats = {
      likesCount: (row.likesCount as number) || 0,
      repliesCount: (row.repliesCount as number) || 0,
      reportsCount: (row.reportsCount as number) || 0
    };
    const metadata: CommentMetadata = row.metadata ? JSON.parse(row.metadata as string) : {
      isEdited: false,
      isPinned: false,
      isHighlighted: false,
      language: 'en',
      moderationStatus: 'pending'
    };

    return new Comment(
      row.id as string,
      row.postId as string,
      row.authorId as string,
      content,
      row.status as CommentStatus,
      stats,
      metadata,
      new Date(row.createdAt as number),
      new Date(row.updatedAt as number),
      row.parentId as string | undefined
    );
  }
}
