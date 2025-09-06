'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/app/core/ui/elements/Button';
import { Card } from '@/app/core/ui/elements/Card';
import { Avatar } from '@/app/core/ui/elements/Avatar';
import { 
  Heart, 
  MoreHorizontal,
  Reply,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { CommentResponseDto } from '@/core/application/dto/CommentDto';
import { LikeReaction } from '@/core/domain/entities/Like';
import { formatDistanceToNow } from 'date-fns';

interface CommentCardProps {
  comment: CommentResponseDto;
  onLike?: (commentId: string, reaction: LikeReaction) => void;
  onReply?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  className?: string;
  showReplies?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  className = '',
  showReplies = true
}) => {
  const { user } = useUser();
  const [showOptions, setShowOptions] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLikedByCurrentUser || false);
  const [currentReaction, setCurrentReaction] = useState<LikeReaction | undefined>(
    comment.currentUserReaction as LikeReaction
  );

  // TODO: Implement reaction picker for comments
  // const reactions: Array<{ type: LikeReaction; emoji: string; label: string }> = [
  //   { type: LikeReaction.LIKE, emoji: '👍', label: 'Like' },
  //   { type: LikeReaction.LOVE, emoji: '❤️', label: 'Love' },
  //   { type: LikeReaction.HAHA, emoji: '😂', label: 'Haha' },
  //   { type: LikeReaction.WOW, emoji: '😮', label: 'Wow' },
  //   { type: LikeReaction.SAD, emoji: '😢', label: 'Sad' },
  //   { type: LikeReaction.ANGRY, emoji: '😠', label: 'Angry' },
  //   { type: LikeReaction.CARE, emoji: '🤗', label: 'Care' }
  // ];

  const isAuthor = user?.id === comment.authorId;
  const canEdit = isAuthor && comment.status === 'active';
  const canDelete = isAuthor;

  const handleLike = (reaction: LikeReaction = LikeReaction.LIKE) => {
    if (!user) return;

    if (isLiked && currentReaction === reaction) {
      // Unlike
      setIsLiked(false);
      setCurrentReaction(undefined);
      onLike?.(comment.id, reaction);
    } else {
      // Like or change reaction
      setIsLiked(true);
      setCurrentReaction(reaction);
      onLike?.(comment.id, reaction);
    }
  };

  const handleReply = () => {
    onReply?.(comment.id);
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

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar
              src={comment.author.avatar}
              alt={comment.author.displayName}
              fallback={comment.author.displayName.charAt(0)}
              className="h-8 w-8"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {comment.author.displayName}
                </h4>
                {comment.metadata.isPinned && (
                  <span className="text-xs text-blue-600 font-medium">📌 Pinned</span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>@{comment.author.username}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                {comment.metadata.isEdited && (
                  <>
                    <span>•</span>
                    <span className="text-gray-400">(edited)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Options Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(!showOptions)}
              className="text-gray-500 hover:text-gray-700 h-6 w-6 p-0"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>

            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {canEdit && (
                    <button
                      onClick={() => {
                        onEdit?.(comment.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit
                    </button>
                  )}
                  
                  {canDelete && (
                    <button
                      onClick={() => {
                        onDelete?.(comment.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </button>
                  )}
                  
                  {!isAuthor && (
                    <button
                      onClick={() => {
                        onReport?.(comment.id);
                        setShowOptions(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      <Flag className="h-3 w-3 mr-2" />
                      Report
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="text-gray-900 text-sm leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: formatContent(comment.content.text) }}
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <div className="flex items-center space-x-3">
            <span>{comment.stats.likesCount} likes</span>
            {comment.stats.repliesCount > 0 && (
              <span>{comment.stats.repliesCount} replies</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLike()}
            className={`flex items-center space-x-1 text-xs ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </Button>

          {showReplies && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReply}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700"
            >
              <Reply className="h-3 w-3" />
              <span>Reply</span>
            </Button>
          )}
        </div>

        {/* Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 space-y-3 pt-3 border-l-2 border-gray-100 pl-4">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                onLike={onLike}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onReport={onReport}
                showReplies={false}
                className="bg-gray-50"
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
