'use client'

import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs'

import { PostFeed, LikeReaction, CreatePost, PostPrivacy } from '../../modules/post'
import { usePostFeed } from '../../modules/post/hooks/usePostQueries'
import { useLikePost, useDeletePost } from '../../modules/post/hooks/usePostMutations'
import MainNav from '../core/ui/components/MainNav'

const HomePage = () => {
  const { user } = useUser()
  const [showCreatePost, setShowCreatePost] = useState(false)
  
  // React Query hooks
  const { data: feedData, isLoading } = usePostFeed({
    page: 1,
    limit: 20,
    privacy: PostPrivacy.PUBLIC
  })
  
  const likePostMutation = useLikePost()
  const deletePostMutation = useDeletePost()
  
  const posts = feedData?.posts || []
  const hasMore = feedData?.pagination ? (feedData.pagination.page || 1) < (feedData.pagination.totalPages || 1) : false

  const handleLike = (postId: string, reaction: LikeReaction) => {
    likePostMutation.mutate({ postId, reaction })
  }

  const handleComment = () => {
    console.log('Comment functionality coming soon')
    // TODO: Implement comment functionality
  }

  const handleShare = (postId: string) => {
    console.log('Share post:', postId)
    // TODO: Implement share functionality
  }

  const handleEdit = (postId: string) => {
    console.log('Edit post:', postId)
    // TODO: Implement edit functionality
  }

  const handleDelete = (postId: string) => {
    deletePostMutation.mutate(postId)
  }

  const handleReport = (postId: string) => {
    console.log('Report post:', postId)
    // TODO: Implement report functionality
  }

  const handleRefresh = async () => {
    // React Query will handle refetching
    console.log('Refreshing posts...')
  }

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more posts')
  }

  const handlePostCreated = () => {
    // React Query will automatically refetch and show the new post
    setShowCreatePost(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Section */}
          {user && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.firstName || user.username || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mb-4">
                Share your thoughts, videos, or updates with your community.
              </p>
              
              {/* Quick Post Creation */}
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">
                      {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={() => setShowCreatePost(true)}
                      className="w-full text-left text-gray-500 hover:text-gray-700 bg-white rounded-lg px-4 py-3 border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      What&apos;s on your mind?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <CreatePost
                  onPostCreated={handlePostCreated}
                  onCancel={() => setShowCreatePost(false)}
                />
              </div>
            </div>
          )}

          {/* Posts Feed */}
          <PostFeed
            posts={posts}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReport={handleReport}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            showCreatePost={false} // We're handling this separately now
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage