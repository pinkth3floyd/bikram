import { Post, PostContent, PostPrivacy } from '../../domain/entities/Post';
import { PostRepository } from '../../domain/repositories/PostRepository';
import { CreatePostDto } from '../dto/PostDto';

export class CreatePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(dto: CreatePostDto, authorId: string): Promise<Post> {
    // Validate input
    this.validateCreatePostDto(dto);

    // Create post entity
    const post = Post.create(
      authorId,
      dto.content,
      dto.privacy || PostPrivacy.PUBLIC,
      dto.scheduledFor
    );

    // Save to repository
    const createdPost = await this.postRepository.create(post);

    return createdPost;
  }

  private validateCreatePostDto(dto: CreatePostDto): void {
    if (!dto.content) {
      throw new Error('Post content is required');
    }

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
