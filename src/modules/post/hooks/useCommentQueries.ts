'use client'

import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/core/application/actions/commentActions';

export function useComments(postId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ['comments', postId, page, limit],
    queryFn: () => getComments(postId, page, limit),
    enabled: !!postId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
