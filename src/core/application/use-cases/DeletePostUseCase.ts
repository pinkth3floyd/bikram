import { PostRepository } from '../../domain/repositories/PostRepository';
import { Post } from '../../domain/entities/Post';
import { blobService } from '../../infrastructure/services/BlobService';

export class DeletePostUseCase {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, userId: string): Promise<void> {
    // Get existing post
    const existingPost = await this.postRepository.findById(postId);
    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Check if user can delete this post
    if (existingPost.getAuthorId() !== userId) {
      throw new Error('Unauthorized to delete this post');
    }

    // Delete associated files from blob storage
    await this.deleteAssociatedFiles(existingPost);

    // Delete from repository
    await this.postRepository.delete(postId);
  }

  private async deleteAssociatedFiles(post: Post): Promise<void> {
    try {
      const content = post.getContent();
      
      // Delete video file if exists
      if (content.videoUrl && content.videoUrl.startsWith('http')) {
        await blobService.deleteFile(content.videoUrl);
      }

      // Delete image file if exists
      if (content.imageUrl && content.imageUrl.startsWith('http')) {
        await blobService.deleteFile(content.imageUrl);
      }

      // Delete video thumbnail if exists
      if (content.videoThumbnail && content.videoThumbnail.startsWith('http')) {
        await blobService.deleteFile(content.videoThumbnail);
      }
    } catch (error) {
      console.error('Error deleting associated files:', error);
      // Don't throw error here as the post deletion should still proceed
    }
  }
}
