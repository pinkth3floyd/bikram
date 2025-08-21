'use server'

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { CreatePostUseCase } from '../use-cases/CreatePostUseCase';
import { GetPostFeedUseCase } from '../use-cases/GetPostFeedUseCase';
import { UpdatePostUseCase } from '../use-cases/UpdatePostUseCase';
import { DeletePostUseCase } from '../use-cases/DeletePostUseCase';
import { CreatePostDto, GetPostFeedDto, UpdatePostDto } from '../dto/PostDto';
import { initDatabase, getDatabaseService } from '@/core/infrastructure/database/init';
import { blobService } from '@/core/infrastructure/services/BlobService';
import { ensureUserExists } from './userActions';

export async function createPost(data: CreatePostDto) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const postRepository = databaseService.getPostRepository();
    
    // Handle file uploads if present
    const processedContent = { ...data.content };
    
    if (data.content.videoFile) {
      try {
        const uploadResult = await blobService.uploadVideo(
          data.content.videoFile,
          `videos/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`
        );
        processedContent.videoUrl = uploadResult.url;
        delete processedContent.videoFile;
      } catch (error) {
        console.error('Error uploading video:', error);
        return {
          success: false,
          error: 'Failed to upload video file'
        };
      }
    }
    
    if (data.content.imageFile) {
      try {
        const uploadResult = await blobService.uploadImage(
          data.content.imageFile,
          `images/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        );
        processedContent.imageUrl = uploadResult.url;
        delete processedContent.imageFile;
      } catch (error) {
        console.error('Error uploading image:', error);
        return {
          success: false,
          error: 'Failed to upload image file'
        };
      }
    }
    
    // Create post use case
    const createPostUseCase = new CreatePostUseCase(postRepository);
    
    // Execute the use case
    const post = await createPostUseCase.execute({
      ...data,
      content: processedContent
    }, userId);

    // Revalidate the home page to show the new post
    revalidatePath('/home');
    
    return {
      success: true,
      post: {
        id: post.getId(),
        authorId: post.getAuthorId(),
        content: post.getContent(),
        type: post.getType(),
        privacy: post.getPrivacy(),
        stats: post.getStats(),
        metadata: post.getMetadata(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
        publishedAt: post.getPublishedAt(),
        scheduledFor: post.getScheduledFor()
      }
    };

  } catch (error) {
    console.error('Error creating post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create post'
    };
  }
}

export async function getPostFeed(data: GetPostFeedDto) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const postRepository = databaseService.getPostRepository();

    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists',
        posts: [],
        pagination: {
          page: data.page,
          limit: data.limit,
          total: 0,
          totalPages: 0
        }
      };
    }
    
    // Create get post feed use case
    const getPostFeedUseCase = new GetPostFeedUseCase(postRepository);
    
    // Execute the use case
    const result = await getPostFeedUseCase.execute(
      userId,
      data.page || 1,
      data.limit || 20
    );

    return {
      success: true,
      ...result
    };

  } catch (error) {
    console.error('Error fetching post feed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts',
      posts: [],
      pagination: {
        page: data.page,
        limit: data.limit,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export async function likePost(postId: string, reaction: string = 'like') {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    
    // TODO: Implement like post use case
    // For now, just return success
    console.log(`User ${userId} liked post ${postId} with reaction ${reaction}`);

    // Revalidate the home page
    revalidatePath('/home');
    
    return {
      success: true
    };

  } catch (error) {
    console.error('Error liking post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to like post'
    };
  }
}

export async function unlikePost(postId: string) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    
    // TODO: Implement unlike post use case
    // For now, just return success
    console.log(`User ${userId} unliked post ${postId}`);

    // Revalidate the home page
    revalidatePath('/home');
    
    return {
      success: true
    };

  } catch (error) {
    console.error('Error unliking post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unlike post'
    };
  }
}

export async function updatePost(postId: string, data: UpdatePostDto) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const postRepository = databaseService.getPostRepository();

    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists'
      };
    }
    
    // Handle file uploads if present
    const processedContent = data.content ? { ...data.content } : undefined;
    
    if (data.content && 'videoFile' in data.content && data.content.videoFile) {
      try {
        const uploadResult = await blobService.uploadVideo(
          data.content.videoFile as File,
          `videos/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.mp4`
        );
        if (processedContent) {
          processedContent.videoUrl = uploadResult.url;
          delete (processedContent as Record<string, unknown>).videoFile;
        }
      } catch (error) {
        console.error('Error uploading video:', error);
        return {
          success: false,
          error: 'Failed to upload video file'
        };
      }
    }
    
    if (data.content && 'imageFile' in data.content && data.content.imageFile) {
      try {
        const uploadResult = await blobService.uploadImage(
          data.content.imageFile as File,
          `images/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        );
        if (processedContent) {
          processedContent.imageUrl = uploadResult.url;
          delete (processedContent as Record<string, unknown>).imageFile;
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        return {
          success: false,
          error: 'Failed to upload image file'
        };
      }
    }
    
    // Create update post use case
    const updatePostUseCase = new UpdatePostUseCase(postRepository);
    
    // Execute the use case
    const post = await updatePostUseCase.execute(postId, {
      ...data,
      content: processedContent
    }, userId);

    // Revalidate the home page
    revalidatePath('/home');
    
    return {
      success: true,
      post: {
        id: post.getId(),
        authorId: post.getAuthorId(),
        content: post.getContent(),
        type: post.getType(),
        privacy: post.getPrivacy(),
        stats: post.getStats(),
        metadata: post.getMetadata(),
        createdAt: post.getCreatedAt(),
        updatedAt: post.getUpdatedAt(),
        publishedAt: post.getPublishedAt(),
        scheduledFor: post.getScheduledFor()
      }
    };

  } catch (error) {
    console.error('Error updating post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update post'
    };
  }
}

export async function deletePost(postId: string) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    const databaseService = getDatabaseService();
    const postRepository = databaseService.getPostRepository();

    // Ensure user exists in our database
    const userResult = await ensureUserExists(userId);
    if (!userResult.success) {
      return {
        success: false,
        error: userResult.error || 'Failed to ensure user exists'
      };
    }
    
    // Create delete post use case
    const deletePostUseCase = new DeletePostUseCase(postRepository);
    
    // Execute the use case
    await deletePostUseCase.execute(postId, userId);

    // Revalidate the home page
    revalidatePath('/home');
    
    return {
      success: true
    };

  } catch (error) {
    console.error('Error deleting post:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete post'
    };
  }
}
