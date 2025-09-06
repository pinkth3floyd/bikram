'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/app/core/ui/elements/Button';
import { CreatePost } from './CreatePost';
import { PostCard } from './PostCard';
import { PostResponseDto } from '@/core/application/dto/PostDto';
import { LikeReaction } from '@/core/domain/entities/Like';
import { Plus, RefreshCw, Loader2 } from 'lucide-react';

interface PostFeedProps {
  className?: string;
  showCreatePost?: boolean;
  posts?: PostResponseDto[];
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onLike?: (postId: string, reaction: LikeReaction) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export const PostFeed: React.FC<PostFeedProps> = ({
  className = '',
  showCreatePost = true,
  posts = [],
  onLoadMore,
  onRefresh,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  onReport,
  isLoading = false,
  hasMore = false
}) => {
  const { user } = useUser();
  const [showCreatePostForm, setShowCreatePostForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handlePostCreated = (_postId: string) => {
    setShowCreatePostForm(false);
    // Refresh the feed to show the new post
    handleRefresh();
  };

  const handleLike = (postId: string, reaction: LikeReaction) => {
    onLike?.(postId, reaction);
  };

  const handleComment = (postId: string) => {
    onComment?.(postId);
  };

  const handleShare = (postId: string) => {
    onShare?.(postId);
  };

  const handleEdit = (postId: string) => {
    onEdit?.(postId);
  };

  const handleDelete = (postId: string) => {
    onDelete?.(postId);
  };

  const handleReport = (postId: string) => {
    onReport?.(postId);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          {showCreatePost && user && (
            <Button
              onClick={() => setShowCreatePostForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
          )}
        </div>
      </div>

      {/* Create Post Form */}
      {showCreatePostForm && (
        <CreatePost
          onPostCreated={handlePostCreated}
          onCancel={() => setShowCreatePostForm(false)}
        />
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading && posts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading posts...</span>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">No posts yet</p>
              <p className="text-sm mt-1">
                {user ? 'Be the first to create a post!' : 'Sign in to see posts'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={handleReport}
              />
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Load More Posts</span>
                  )}
                </Button>
              </div>
            )}

            {/* End of Feed */}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400">
                  <p className="text-sm">You&apos;ve reached the end of the feed</p>
                  <p className="text-xs mt-1">Check back later for more posts!</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
