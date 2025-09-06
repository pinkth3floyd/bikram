import { Comment } from '../../domain/entities/Comment';
import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { CommentResponseDto, CommentThreadDto } from '../dto/CommentDto';

export class GetCommentsUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository
  ) {}

  async execute(postId: string, page: number = 1, limit: number = 20): Promise<{
    comments: CommentResponseDto[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Validate input
    this.validateInput(page, limit);

    // Get comments from repository
    const result = await this.commentRepository.findByPostWithPagination(postId, page, limit);

    // Convert to DTOs
    const comments = await Promise.all(
      result.comments.map(comment => this.convertToResponseDto(comment))
    );

    return {
      comments,
      total: result.total,
      page: result.page,
      totalPages: result.totalPages
    };
  }

  async getCommentThread(commentId: string): Promise<CommentThreadDto> {
    // Get the main comment
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    // Get replies
    const replies = await this.commentRepository.findReplies(commentId);
    const replyDtos = await Promise.all(
      replies.map(reply => this.convertToResponseDto(reply))
    );

    const commentDto = await this.convertToResponseDto(comment);

    return {
      comment: commentDto,
      replies: replyDtos,
      totalReplies: replies.length,
      hasMoreReplies: false // For now, we're not implementing pagination for replies
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

  private async convertToResponseDto(comment: Comment): Promise<CommentResponseDto> {
    const content = comment.getContent();
    const stats = comment.getStats();
    const metadata = comment.getMetadata();

    // Fetch author information
    const author = await this.userRepository.findById(comment.getAuthorId());
    const authorProfile = author?.getProfile();

    return {
      id: comment.getId(),
      postId: comment.getPostId(),
      authorId: comment.getAuthorId(),
      author: {
        id: comment.getAuthorId(),
        displayName: authorProfile?.displayName || 'Unknown User',
        username: author?.getUsername() || 'unknown',
        avatar: authorProfile?.avatar
      },
      parentId: comment.getParentId(),
      content,
      status: comment.getStatus(),
      stats: {
        likesCount: stats.likesCount,
        repliesCount: stats.repliesCount,
        reportsCount: stats.reportsCount
      },
      metadata: {
        isEdited: metadata.isEdited,
        isPinned: metadata.isPinned,
        isHighlighted: metadata.isHighlighted,
        language: metadata.language,
        moderationStatus: metadata.moderationStatus
      },
      createdAt: comment.getCreatedAt().toISOString(),
      updatedAt: comment.getUpdatedAt().toISOString(),
      isLikedByCurrentUser: false, // This would be checked against like repository
      currentUserReaction: undefined // This would be fetched from like repository
    };
  }
}
