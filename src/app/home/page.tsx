'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

import { PostFeed, PostResponseDto, LikeReaction, PostType, PostPrivacy } from '../../modules/post'
import MainNav from '../core/ui/components/MainNav'

const HomePage = () => {
  const { user } = useUser()
  const [posts, setPosts] = useState<PostResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)

  // Mock data for demonstration
  const mockPosts: PostResponseDto[] = [
    {
      id: '1',
      authorId: 'user1',
      author: {
        id: 'user1',
        displayName: 'John Doe',
        username: 'johndoe',
        avatar: undefined
      },
      content: {
        text: 'Just created my first post! 🎉 #excited #firstpost',
        hashtags: ['excited', 'firstpost'],
        mentions: []
      },
      type: PostType.TEXT,
      privacy: PostPrivacy.PUBLIC,
      stats: {
        likesCount: 5,
        commentsCount: 2,
        sharesCount: 1,
        viewsCount: 25,
        engagementRate: 0.32
      },
      metadata: {
        isEdited: false,
        isPinned: false,
        isPromoted: false,
        isSponsored: false,
        language: 'en',
        moderationStatus: 'approved'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isLikedByCurrentUser: false,
      currentUserReaction: undefined
    },
    {
      id: '2',
      authorId: 'user2',
      author: {
        id: 'user2',
        displayName: 'Jane Smith',
        username: 'janesmith',
        avatar: undefined
      },
      content: {
        text: 'Check out this amazing video!',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoDuration: 212,
        hashtags: ['video', 'amazing'],
        mentions: []
      },
      type: PostType.MIXED,
      privacy: PostPrivacy.PUBLIC,
      stats: {
        likesCount: 12,
        commentsCount: 5,
        sharesCount: 3,
        viewsCount: 150,
        engagementRate: 0.13
      },
      metadata: {
        isEdited: false,
        isPinned: false,
        isPromoted: false,
        isSponsored: false,
        language: 'en',
        moderationStatus: 'approved'
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      isLikedByCurrentUser: true,
      currentUserReaction: 'love'
    }
  ]

  useEffect(() => {
    // Simulate loading posts
    const loadPosts = async () => {
      setIsLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts(mockPosts)
      setIsLoading(false)
      setHasMore(false)
    }

    loadPosts()
  }, [])

  const handleLike = (postId: string, reaction: LikeReaction) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const isCurrentlyLiked = post.isLikedByCurrentUser
          return {
            ...post,
            isLikedByCurrentUser: !isCurrentlyLiked,
            currentUserReaction: !isCurrentlyLiked ? reaction : undefined,
            stats: {
              ...post.stats,
              likesCount: isCurrentlyLiked 
                ? post.stats.likesCount - 1 
                : post.stats.likesCount + 1
            }
          }
        }
        return post
      })
    )
  }

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId)
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
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
  }

  const handleReport = (postId: string) => {
    console.log('Report post:', postId)
    // TODO: Implement report functionality
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setPosts(mockPosts)
    setIsLoading(false)
  }

  const handleLoadMore = () => {
    // TODO: Implement load more functionality
    console.log('Load more posts')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
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
            showCreatePost={!!user}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage