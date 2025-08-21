import { Post, PostPrivacy } from '../../domain/entities/Post';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { UpdatePostDto } from '../dto/PostDto';

export class UpdatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, dto: UpdatePostDto, userId: string): Promise<Post> {
    // Validate input
    this.validateUpdatePostDto(dto);

    // Get existing post
    const existingPost = await this.postRepository.findById(postId);
    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Check if user can edit this post
    if (existingPost.getAuthorId() !== userId) {
      throw new Error('Unauthorized to edit this post');
    }

    // Create updated post entity
    const updatedPost = new Post(
      existingPost.getId(),
      existingPost.getAuthorId(),
      dto.content || existingPost.getContent(),
      existingPost.getType(),
      dto.privacy || existingPost.getPrivacy(),
      existingPost.getStats(),
      {
        ...existingPost.getMetadata(),
        isEdited: true,
        editHistory: [
          ...(existingPost.getMetadata().editHistory || []),
          {
            timestamp: new Date(),
            content: existingPost.getContent(),
            reason: dto.editReason
          }
        ]
      },
      existingPost.getCreatedAt(),
      new Date(), // updatedAt
      existingPost.getPublishedAt(),
      dto.scheduledFor || existingPost.getScheduledFor()
    );

    // Save to repository
    const savedPost = await this.postRepository.update(updatedPost);

    return savedPost;
  }

  private validateUpdatePostDto(dto: UpdatePostDto): void {
    if (dto.content) {
      const { text, videoUrl } = dto.content;

      // At least one of text or video must be provided
      if (!text && !videoUrl) {
        throw new Error('Post must contain either text or video content');
      }

      // Validate text content
      if (text && text.trim().length === 0) {
        throw new Error('Text content cannot be empty');
      }

      if (text && text.length > 10000) {
        throw new Error('Text content cannot exceed 10,000 characters');
      }

      // Validate video URL
      if (videoUrl && !this.isValidVideoUrl(videoUrl)) {
        throw new Error('Invalid video URL format');
      }
    }

    // Validate scheduled date
    if (dto.scheduledFor && dto.scheduledFor <= new Date()) {
      throw new Error('Scheduled date must be in the future');
    }

    // Validate privacy setting
    if (dto.privacy && !Object.values(PostPrivacy).includes(dto.privacy)) {
      throw new Error('Invalid privacy setting');
    }
  }

  private isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const validDomains = [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'dailymotion.com',
        'facebook.com',
        'instagram.com',
        'tiktok.com'
      ];
      
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  }
}
