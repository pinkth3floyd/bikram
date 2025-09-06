'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/app/core/ui/elements/Button';
import { TextArea } from '@/app/core/ui/elements/TextArea';
import { Avatar } from '@/app/core/ui/elements/Avatar';
import { CommentCard } from './CommentCard';
import { CommentResponseDto } from '@/core/application/dto/CommentDto';
import { LikeReaction } from '@/core/domain/entities/Like';
import { createComment, getComments } from '@/core/application/actions/commentActions';
import { MessageCircle, Send, Loader2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  onCommentAdded?: () => void;
  className?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onCommentAdded,
  className = ''
}) => {
  const { user } = useUser();
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const result = await getComments(postId, 1, 50);
      if (result.success) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      const result = await createComment({
        postId,
        content: {
          text: newComment.trim()
        }
      });

      if (result.success) {
        setNewComment('');
        await loadComments();
        onCommentAdded?.();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyText.trim()) return;

    try {
      setSubmitting(true);
      const result = await createComment({
        postId,
        content: {
          text: replyText.trim()
        },
        parentId
      });

      if (result.success) {
        setReplyText('');
        setReplyingTo(null);
        await loadComments();
        onCommentAdded?.();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = (commentId: string, reaction: LikeReaction) => {
    // TODO: Implement comment like functionality
    console.log('Like comment:', commentId, reaction);
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleEdit = (commentId: string) => {
    // TODO: Implement comment edit functionality
    console.log('Edit comment:', commentId);
  };

  const handleDelete = (commentId: string) => {
    // TODO: Implement comment delete functionality
    console.log('Delete comment:', commentId);
  };

  const handleReport = (commentId: string) => {
    // TODO: Implement comment report functionality
    console.log('Report comment:', commentId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comment Input */}
      {user && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <Avatar
              src={user.imageUrl}
              alt={user.firstName || 'User'}
              fallback={user.firstName?.charAt(0) || 'U'}
              className="h-8 w-8"
            />
            <div className="flex-1 space-y-3">
              <TextArea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={2000}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {newComment.length}/2000 characters
                </span>
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span>Comment</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading comments...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No comments yet</p>
            <p className="text-gray-400 text-xs mt-1">
              {user ? 'Be the first to comment!' : 'Sign in to comment'}
            </p>
          </div>
        ) : (
          <>
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                <CommentCard
                  comment={comment}
                  onLike={handleLike}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReport={handleReport}
                />
                
                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <div className="ml-8 bg-gray-50 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={user?.imageUrl}
                        alt={user?.firstName || 'User'}
                        fallback={user?.firstName?.charAt(0) || 'U'}
                        className="h-6 w-6"
                      />
                      <div className="flex-1 space-y-2">
                        <TextArea
                          placeholder={`Reply to ${comment.author.displayName}...`}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[60px] resize-none text-sm"
                          maxLength={2000}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {replyText.length}/2000 characters
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={!replyText.trim() || submitting}
                              size="sm"
                              className="flex items-center space-x-1 text-xs"
                            >
                              {submitting ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Send className="h-3 w-3" />
                              )}
                              <span>Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
