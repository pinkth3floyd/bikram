'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/app/core/ui/elements/Button';
import { Card } from '@/app/core/ui/elements/Card';
import { Badge } from '@/app/core/ui/elements/Badge';
import { Avatar } from '@/app/core/ui/elements/Avatar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Globe,
  Lock,
  Users,
  Clock,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { PostResponseDto } from '@/core/application/dto/PostDto';
import { LikeReaction } from '@/core/domain/entities/Like';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: PostResponseDto;
  onLike?: (postId: string, reaction: LikeReaction) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
  className?: string;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
  onReport,
  className = ''
}) => {
  const { user } = useUser();
  const [showReactions, setShowReactions] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [currentReaction, setCurrentReaction] = useState<LikeReaction | undefined>(
    post.currentUserReaction as LikeReaction
  );

  const reactions: Array<{ type: LikeReaction; emoji: string; label: string }> = [
    { type: LikeReaction.LIKE, emoji: '👍', label: 'Like' },
    { type: LikeReaction.LOVE, emoji: '❤️', label: 'Love' },
    { type: LikeReaction.HAHA, emoji: '😂', label: 'Haha' },
    { type: LikeReaction.WOW, emoji: '😮', label: 'Wow' },
    { type: LikeReaction.SAD, emoji: '😢', label: 'Sad' },
    { type: LikeReaction.ANGRY, emoji: '😠', label: 'Angry' },
    { type: LikeReaction.CARE, emoji: '🤗', label: 'Care' }
  ];

  const isAuthor = user?.id === post.authorId;
  const canEdit = isAuthor && !post.metadata.isPromoted;
  const canDelete = isAuthor;

  const handleLike = (reaction: LikeReaction = LikeReaction.LIKE) => {
    if (!user) return;

    if (isLiked && currentReaction === reaction) {
      // Unlike
      setIsLiked(false);
      setCurrentReaction(undefined);
      onLike?.(post.id, reaction);
    } else {
      // Like or change reaction
      setIsLiked(true);
      setCurrentReaction(reaction);
      onLike?.(post.id, reaction);
    }
    setShowReactions(false);
  };

  const handleComment = () => {
    onComment?.(post.id);
  };

  const handleShare = () => {
    onShare?.(post.id);
  };

  const getPrivacyIcon = () => {
    switch (post.privacy) {
      case 'public':
        return <Globe className="h-3 w-3" />;
      case 'friends':
        return <Users className="h-3 w-3" />;
      case 'private':
        return <Lock className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  const getPrivacyLabel = () => {
    switch (post.privacy) {
      case 'public':
        return 'Public';
      case 'friends':
        return 'Friends';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };

  const formatContent = (text: string) => {
    // Convert hashtags to clickable elements
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    
    const formattedText = text
      .replace(hashtagRegex, '<span class="text-blue-600 font-medium">#$1</span>')
      .replace(mentionRegex, '<span class="text-blue-600 font-medium">@$1</span>');
    
    return formattedText;
  };

  const renderVideoContent = () => {
    if (!post.content.videoUrl) return null;

    return (
      <div className="relative mt-3 rounded-lg overflow-hidden bg-gray-100">
        <div className="aspect-video relative">
          <iframe
            src={post.content.videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            title="Post video"
          />
          {post.content.videoDuration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {Math.floor(post.content.videoDuration / 60)}:{(post.content.videoDuration % 60).toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={post.author.avatar}
              alt={post.author.displayName}
              fallback={post.author.displayName.charAt(0)}
              className="h-10 w-10"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">
                  {post.author.displayName}
                </h4>
                {post.metadata.isPromoted && (
                  <Badge variant="info" className="text-xs">
                    ✓ Promoted
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>@{post.author.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                {post.scheduledFor && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Scheduled</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <div className="flex items-center space-x-1">
                  {getPrivacyIcon()}
                  <span>{getPrivacyLabel()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {canEdit && (
                    <button
                      onClick={() => {
                        onEdit?.(post.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </button>
                  )}
                  
                  {canDelete && (
                    <button
                      onClick={() => {
                        onDelete?.(post.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Post
                    </button>
                  )}
                  
                  {!isAuthor && (
                    <button
                      onClick={() => {
                        onReport?.(post.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Report Post
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Text Content */}
          {post.content.text && (
            <div 
              className="text-gray-900 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content.text) }}
            />
          )}

          {/* Video Content */}
          {renderVideoContent()}

          {/* Hashtags */}
          {post.content.hashtags && post.content.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.content.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Mentions */}
          {post.content.mentions && post.content.mentions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.content.mentions.map((mention, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  @{mention}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-4">
            <span>{post.stats.likesCount} likes</span>
            <span>{post.stats.commentsCount} comments</span>
            <span>{post.stats.sharesCount} shares</span>
            {post.stats.viewsCount > 0 && (
              <span>{post.stats.viewsCount} views</span>
            )}
          </div>
          
          {post.metadata.isEdited && (
            <span className="text-xs text-gray-400">(edited)</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-1">
            {/* Like Button */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike()}
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </Button>

              {/* Reaction Picker */}
              {showReactions && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20">
                  <div className="flex items-center space-x-1">
                    {reactions.map((reaction) => (
                      <button
                        key={reaction.type}
                        onClick={() => handleLike(reaction.type)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={reaction.label}
                      >
                        <span className="text-lg">{reaction.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comment Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comment</span>
            </Button>

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
