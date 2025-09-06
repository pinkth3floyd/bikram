import { Comment } from '../../domain/entities/Comment';
import { CommentRepository } from '../../domain/repositories/CommentRepository';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { CreateCommentDto } from '../dto/CommentDto';

export class CreateCommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository
  ) {}

  async execute(dto: CreateCommentDto, authorId: string): Promise<Comment> {
    // Validate input
    this.validateCreateCommentDto(dto);

    // Check if post exists
    const post = await this.postRepository.findById(dto.postId);
    if (!post) {
      throw new Error('Post not found');
    }

    // Check if parent comment exists (for replies)
    if (dto.parentId) {
      const parentComment = await this.commentRepository.findById(dto.parentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
      if (parentComment.getPostId() !== dto.postId) {
        throw new Error('Parent comment does not belong to the specified post');
      }
    }

    // Create comment entity
    const comment = Comment.create(
      dto.postId,
      authorId,
      dto.content,
      dto.parentId
    );

    // Save to repository
    const createdComment = await this.commentRepository.create(comment);

    // Update post comment count
    const updatedPost = post.incrementComments();
    await this.postRepository.update(updatedPost);

    // Update parent comment replies count if it's a reply
    if (dto.parentId) {
      const parentComment = await this.commentRepository.findById(dto.parentId);
      if (parentComment) {
        const updatedParentComment = parentComment.incrementReplies();
        await this.commentRepository.update(updatedParentComment);
      }
    }

    return createdComment;
  }

  private validateCreateCommentDto(dto: CreateCommentDto): void {
    if (!dto.postId) {
      throw new Error('Post ID is required');
    }

    if (!dto.content) {
      throw new Error('Comment content is required');
    }

    if (!dto.content.text || dto.content.text.trim().length === 0) {
      throw new Error('Comment text cannot be empty');
    }

    if (dto.content.text.length > 2000) {
      throw new Error('Comment text cannot exceed 2,000 characters');
    }
  }
}
