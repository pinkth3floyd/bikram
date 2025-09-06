import { Post } from '../../domain/entities/Post';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PostFeedDto, PostResponseDto } from '../dto/PostDto';

export class GetPostFeedUseCase {
  constructor(
    private postRepository: PostRepository,
    private userRepository: UserRepository
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 20): Promise<PostFeedDto> {
    // Validate input
    this.validateInput(page, limit);

    // Get feed from repository
    const result = await this.postRepository.getFeedForUser(userId, page, limit);

    // Convert to DTOs
    const posts = await Promise.all(
      result.posts.map(post => this.convertToResponseDto(post, userId))
    );

    return {
      posts,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages,
      hasMore: result.page < result.totalPages
    };
  }

  private validateInput(page: number, limit: number): void {
    if (page < 1) {
      throw new Error('Page number must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  private async convertToResponseDto(post: Post, _currentUserId?: string): Promise<PostResponseDto> {
    const content = post.getContent();
    const stats = post.getStats();
    const metadata = post.getMetadata();

    // Fetch author information
    const author = await this.userRepository.findById(post.getAuthorId());
    const authorProfile = author?.getProfile();

    return {
      id: post.getId(),
      authorId: post.getAuthorId(),
      author: {
        id: post.getAuthorId(),
        displayName: authorProfile?.displayName || 'Unknown User',
        username: author?.getUsername() || 'unknown',
        avatar: authorProfile?.avatar
      },
      content,
      type: post.getType(),
      privacy: post.getPrivacy(),
      stats: {
        likesCount: stats.likesCount,
        commentsCount: stats.commentsCount,
        sharesCount: stats.sharesCount,
        viewsCount: stats.viewsCount,
        engagementRate: stats.engagementRate
      },
      metadata: {
        isEdited: metadata.isEdited,
        isPinned: metadata.isPinned,
        isPromoted: metadata.isPromoted,
        isSponsored: metadata.isSponsored,
        language: metadata.language,
        moderationStatus: metadata.moderationStatus
      },
      createdAt: post.getCreatedAt().toISOString(),
      updatedAt: post.getUpdatedAt().toISOString(),
      publishedAt: post.getPublishedAt()?.toISOString(),
      scheduledFor: post.getScheduledFor()?.toISOString(),
      isLikedByCurrentUser: false, // This would be checked against like repository
      currentUserReaction: undefined // This would be fetched from like repository
    };
  }
}
