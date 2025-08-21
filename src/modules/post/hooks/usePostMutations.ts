'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, likePost, unlikePost, deletePost } from '@/core/application/actions/postActions';
import { CreatePostDto } from '@/core/application/dto/PostDto';
import { toast } from 'sonner';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => createPost(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Post created successfully!');
        // Invalidate and refetch posts
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        toast.error(data.error || 'Failed to create post');
      }
    },
    onError: (error) => {
      console.error('Create post error:', error);
      toast.error('Failed to create post. Please try again.');
    }
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, reaction }: { postId: string; reaction?: string }) => 
      likePost(postId, reaction),
    onSuccess: (data) => {
      if (data.success) {
        // Optimistically update the UI
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        toast.error(data.error || 'Failed to like post');
      }
    },
    onError: (error) => {
      console.error('Like post error:', error);
      toast.error('Failed to like post. Please try again.');
    }
  });
}

export function useUnlikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => unlikePost(postId),
    onSuccess: (data) => {
      if (data.success) {
        // Optimistically update the UI
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        toast.error(data.error || 'Failed to unlike post');
      }
    },
    onError: (error) => {
      console.error('Unlike post error:', error);
      toast.error('Failed to unlike post. Please try again.');
    }
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Post deleted successfully!');
        // Invalidate and refetch posts
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } else {
        toast.error(data.error || 'Failed to delete post');
      }
    },
    onError: (error) => {
      console.error('Delete post error:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  });
}
