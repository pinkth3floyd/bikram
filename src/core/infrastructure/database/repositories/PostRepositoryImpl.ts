import { eq, like, and, desc, asc, count, or, gte, lte, sql } from 'drizzle-orm';
import { PostRepository } from '../../../domain/repositories/PostRepository';
import { Post, PostType, PostPrivacy, PostContent, PostStats, PostMetadata } from '../../../domain/entities/Post';
import { db, dbReadonly } from '../connection';
import { posts } from '../schema';

export class PostRepositoryImpl implements PostRepository {
  private readonly database = db;
  private readonly readonlyDatabase = dbReadonly || db;

  // Basic CRUD operations
  async findById(id: string): Promise<Post | null> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1);

      if (result.length === 0) return null;

      return this.mapToPost(result[0]);
    } catch (error) {
      console.error('Error finding post by ID:', error);
      throw new Error('Failed to find post by ID');
    }
  }

  async create(post: Post): Promise<Post> {
    try {
      const postData = {
        id: post.getId(),
        authorId: post.getAuthorId(),
        type: post.getType(),
        privacy: post.getPrivacy(),
        content: JSON.stringify(post.getContent()),
        likesCount: post.getStats().likesCount,
        commentsCount: post.getStats().commentsCount,
        sharesCount: post.getStats().sharesCount,
        viewsCount: post.getStats().viewsCount,
        engagementRate: post.getStats().engagementRate,
        metadata: JSON.stringify(post.getMetadata()),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
        publishedAt: post.getPublishedAt(),
        scheduledFor: post.getScheduledFor()
      };

      await this.database.insert(posts).values(postData);

      return post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  }

  async update(post: Post): Promise<Post> {
    try {
      const postData = {
        type: post.getType(),
        privacy: post.getPrivacy(),
        content: JSON.stringify(post.getContent()),
        likesCount: post.getStats().likesCount,
        commentsCount: post.getStats().commentsCount,
        sharesCount: post.getStats().sharesCount,
        viewsCount: post.getStats().viewsCount,
        engagementRate: post.getStats().engagementRate,
        metadata: JSON.stringify(post.getMetadata()),
        updatedAt: new Date(),
        publishedAt: post.getPublishedAt(),
        scheduledFor: post.getScheduledFor()
      };

      await this.database
        .update(posts)
        .set(postData)
        .where(eq(posts.id, post.getId()));

      return post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database
        .delete(posts)
        .where(eq(posts.id, id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  }

  // Query operations
  async findByAuthor(authorId: string): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.authorId, authorId))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding posts by author:', error);
      throw new Error('Failed to find posts by author');
    }
  }

  async findByType(type: PostType): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.type, type))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding posts by type:', error);
      throw new Error('Failed to find posts by type');
    }
  }

  async findByPrivacy(privacy: PostPrivacy): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.privacy, privacy))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding posts by privacy:', error);
      throw new Error('Failed to find posts by privacy');
    }
  }

  async findPublicPosts(): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.privacy, PostPrivacy.PUBLIC))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding public posts:', error);
      throw new Error('Failed to find public posts');
    }
  }

  async findScheduledPosts(): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(sql`${posts.scheduledFor} IS NOT NULL AND ${posts.scheduledFor} <= ${new Date()}`)
        .orderBy(asc(posts.scheduledFor));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding scheduled posts:', error);
      throw new Error('Failed to find scheduled posts');
    }
  }

  // Feed operations
  async getFeedForUser(userId: string, page: number, limit: number): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await this.readonlyDatabase
        .select({ count: count() })
        .from(posts)
        .where(eq(posts.privacy, PostPrivacy.PUBLIC));

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Get posts
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.privacy, PostPrivacy.PUBLIC))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      const postEntities = result.map(row => this.mapToPost(row));

      return {
        posts: postEntities,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error getting feed for user:', error);
      throw new Error('Failed to get feed for user');
    }
  }

  // Search operations
  async searchPosts(query: string): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.privacy, PostPrivacy.PUBLIC),
            like(posts.content, `%${query}%`)
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }

  async searchByHashtag(hashtag: string): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.privacy, PostPrivacy.PUBLIC),
            like(posts.content, `%#${hashtag}%`)
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error searching posts by hashtag:', error);
      throw new Error('Failed to search posts by hashtag');
    }
  }

  async searchByMention(userId: string): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.privacy, PostPrivacy.PUBLIC),
            like(posts.content, `%@${userId}%`)
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error searching posts by mention:', error);
      throw new Error('Failed to search posts by mention');
    }
  }

  // Statistics
  async getTotalPosts(): Promise<number> {
    try {
      const result = await this.readonlyDatabase
        .select({ count: count() })
        .from(posts);

      return result[0]?.count || 0;
    } catch (error) {
      console.error('Error getting total posts:', error);
      throw new Error('Failed to get total posts');
    }
  }

  async getPostsByType(): Promise<Record<PostType, number>> {
    try {
      const result = await this.readonlyDatabase
        .select({
          type: posts.type,
          count: count()
        })
        .from(posts)
        .groupBy(posts.type);

      const stats: Record<PostType, number> = {
        [PostType.TEXT]: 0,
        [PostType.VIDEO]: 0,
        [PostType.MIXED]: 0
      };

      result.forEach(row => {
        if (row.type in stats) {
          stats[row.type as PostType] = row.count;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting posts by type:', error);
      throw new Error('Failed to get posts by type');
    }
  }

  async getPostsByPrivacy(): Promise<Record<PostPrivacy, number>> {
    try {
      const result = await this.readonlyDatabase
        .select({
          privacy: posts.privacy,
          count: count()
        })
        .from(posts)
        .groupBy(posts.privacy);

      const stats: Record<PostPrivacy, number> = {
        [PostPrivacy.PUBLIC]: 0,
        [PostPrivacy.PRIVATE]: 0,
        [PostPrivacy.FRIENDS]: 0
      };

      result.forEach(row => {
        if (row.privacy in stats) {
          stats[row.privacy as PostPrivacy] = row.count;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting posts by privacy:', error);
      throw new Error('Failed to get posts by privacy');
    }
  }

  // Pagination
  async findWithPagination(page: number, limit: number): Promise<{
    posts: Post[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const offset = (page - 1) * limit;

      // Get total count
      const totalResult = await this.readonlyDatabase
        .select({ count: count() })
        .from(posts);

      const total = totalResult[0]?.count || 0;
      const totalPages = Math.ceil(total / limit);

      // Get posts
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset);

      const postEntities = result.map(row => this.mapToPost(row));

      return {
        posts: postEntities,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error finding posts with pagination:', error);
      throw new Error('Failed to find posts with pagination');
    }
  }

  // Bulk operations
  async updateMany(ids: string[]): Promise<void> {
    try {
      // This is a simplified implementation
      // In a real scenario, you might want to batch update
      for (const id of ids) {
        const post = await this.findById(id);
        if (post) {
          // Apply updates to post entity
          // This would require implementing update methods on the Post entity
          await this.update(post);
        }
      }
    } catch (error) {
      console.error('Error updating many posts:', error);
      throw new Error('Failed to update many posts');
    }
  }

  async deleteMany(ids: string[]): Promise<void> {
    try {
      await this.database
        .delete(posts)
        .where(sql`${posts.id} IN (${ids.join(',')})`);
    } catch (error) {
      console.error('Error deleting many posts:', error);
      throw new Error('Failed to delete many posts');
    }
  }

  // Analytics
  async getPopularPosts(limit: number): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.privacy, PostPrivacy.PUBLIC))
        .orderBy(desc(posts.likesCount))
        .limit(limit);

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error getting popular posts:', error);
      throw new Error('Failed to get popular posts');
    }
  }

  async getTrendingPosts(limit: number): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(eq(posts.privacy, PostPrivacy.PUBLIC))
        .orderBy(desc(posts.engagementRate))
        .limit(limit);

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error getting trending posts:', error);
      throw new Error('Failed to get trending posts');
    }
  }

  async getPostsInPeriod(startDate: Date, endDate: Date): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            gte(posts.createdAt, startDate),
            lte(posts.createdAt, endDate)
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error getting posts in period:', error);
      throw new Error('Failed to get posts in period');
    }
  }

  // Moderation
  async findPendingModeration(): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(like(posts.metadata, '%"moderationStatus":"pending"%'))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding pending moderation posts:', error);
      throw new Error('Failed to find pending moderation posts');
    }
  }

  async findFlaggedPosts(): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(like(posts.metadata, '%"moderationStatus":"flagged"%'))
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error finding flagged posts:', error);
      throw new Error('Failed to find flagged posts');
    }
  }

  // User-specific
  async getPostsForUserProfile(userId: string, viewerId: string): Promise<Post[]> {
    try {
      // This would implement logic to show posts based on privacy settings
      // For now, return public posts
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.authorId, userId),
            or(
              eq(posts.privacy, PostPrivacy.PUBLIC),
              eq(posts.authorId, viewerId)
            )
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error getting posts for user profile:', error);
      throw new Error('Failed to get posts for user profile');
    }
  }

  async getPostsForUserProfilePublic(userId: string): Promise<Post[]> {
    try {
      const result = await this.readonlyDatabase
        .select()
        .from(posts)
        .where(
          and(
            eq(posts.authorId, userId),
            eq(posts.privacy, PostPrivacy.PUBLIC)
          )
        )
        .orderBy(desc(posts.createdAt));

      return result.map(row => this.mapToPost(row));
    } catch (error) {
      console.error('Error getting public posts for user profile:', error);
      throw new Error('Failed to get public posts for user profile');
    }
  }

  // Helper methods
  private mapToPost(row: Record<string, unknown>): Post {
    const content: PostContent = JSON.parse(row.content as string);
    const stats: PostStats = {
      likesCount: (row.likesCount as number) || 0,
      commentsCount: (row.commentsCount as number) || 0,
      sharesCount: (row.sharesCount as number) || 0,
      viewsCount: (row.viewsCount as number) || 0,
      engagementRate: (row.engagementRate as number) || 0
    };
    const metadata: PostMetadata = row.metadata ? JSON.parse(row.metadata as string) : {
      isEdited: false,
      isPinned: false,
      isPromoted: false,
      isSponsored: false,
      language: 'en',
      moderationStatus: 'pending'
    };

    return new Post(
      row.id as string,
      row.authorId as string,
      content,
      row.type as PostType,
      row.privacy as PostPrivacy,
      stats,
      metadata,
      new Date(row.createdAt as number),
      new Date(row.updatedAt as number),
      row.publishedAt ? new Date(row.publishedAt as number) : undefined,
      row.scheduledFor ? new Date(row.scheduledFor as number) : undefined
    );
  }
}
