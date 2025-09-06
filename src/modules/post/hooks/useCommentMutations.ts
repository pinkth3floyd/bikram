'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment } from '@/core/application/actions/commentActions';
import { CreateCommentDto } from '@/core/application/dto/CommentDto';

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch comments for the post
      queryClient.invalidateQueries({
        queryKey: ['comments', variables.postId]
      });
      
      // Invalidate post feed to update comment counts
      queryClient.invalidateQueries({
        queryKey: ['posts', 'feed']
      });
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
    }
  });
}
