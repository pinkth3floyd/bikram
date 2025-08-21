'use client'

import { useQuery } from '@tanstack/react-query';
import { getPostFeed } from '@/core/application/actions/postActions';
import { GetPostFeedDto } from '@/core/application/dto/PostDto';

export function usePostFeed(data: GetPostFeedDto) {
  return useQuery({
    queryKey: ['posts', 'feed', data.page, data.limit],
    queryFn: () => getPostFeed(data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function usePostById(postId: string) {
  return useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      // TODO: Implement getPostById server action
      throw new Error('Not implemented yet');
    },
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
