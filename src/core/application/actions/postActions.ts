'use server'

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { CreatePostUseCase } from '../use-cases/CreatePostUseCase';
import { GetPostFeedUseCase } from '../use-cases/GetPostFeedUseCase';
import { CreatePostDto, GetPostFeedDto } from '../dto/PostDto';
import { PostType, PostPrivacy } from '@/core/domain/entities/Post';
import { initDatabase } from '@/core/infrastructure/database/init';

export async function createPost(data: CreatePostDto) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    
    // TODO: Get post repository from database service
    // For now, return a mock response
    const postId = crypto.randomUUID();
    
    console.log('Creating post:', {
      ...data,
      authorId: userId,
      type: data.content.videoUrl ? PostType.MIXED : PostType.TEXT,
      privacy: data.privacy || PostPrivacy.PUBLIC,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined
    });

    // Revalidate the home page to show the new post
    revalidatePath('/home');
    
    return {
      success: true,
      post: {
        id: postId,
        authorId: userId,
        content: data.content,
        type: data.content.videoUrl ? PostType.MIXED : PostType.TEXT,
        privacy: data.privacy || PostPrivacy.PUBLIC,
        createdAt: new Date(),
        updatedAt: new Date()
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
    
    // TODO: Get post repository from database service
    // For now, return empty feed
    console.log('Fetching post feed for user:', userId, 'with params:', data);

    return {
      success: true,
      posts: [],
      pagination: {
        page: data.page || 1,
        limit: data.limit || 20,
        total: 0,
        totalPages: 0
      }
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

export async function deletePost(postId: string) {
  try {
    // Get user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Initialize database
    await initDatabase();
    
    // TODO: Implement delete post use case
    // For now, just return success
    console.log(`User ${userId} deleted post ${postId}`);

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
