'use client';

import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/app/core/ui/elements/Button';
import { Input } from '@/app/core/ui/elements/Input';
import { TextArea } from '@/app/core/ui/elements/TextArea';
import { Select } from '@/app/core/ui/elements/Select';
import { Card } from '@/app/core/ui/elements/Card';
import { Badge } from '@/app/core/ui/elements/Badge';
import { useCreatePost } from '../hooks/usePostMutations';
import { 
  Video, 
  Globe, 
  Lock, 
  Users, 
  Calendar,
  X,
  Upload
} from 'lucide-react';
import { PostPrivacy } from '@/core/domain/entities/Post';

interface CreatePostProps {
  onPostCreated?: (postId: string) => void;
  onCancel?: () => void;
  className?: string;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  onPostCreated,
  onCancel,
  className = ''
}) => {
  const { user } = useUser();
  const createPostMutation = useCreatePost();
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<PostPrivacy>(PostPrivacy.PUBLIC);
  const [scheduledFor, setScheduledFor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const privacyOptions = [
    { value: PostPrivacy.PUBLIC, label: 'Public', icon: Globe },
    { value: PostPrivacy.FRIENDS, label: 'Friends', icon: Users },
    { value: PostPrivacy.PRIVATE, label: 'Private', icon: Lock }
  ];

  const handleTextChange = (value: string) => {
    setText(value);
    extractHashtagsAndMentions(value);
  };

  const extractHashtagsAndMentions = (content: string) => {
    // Extract hashtags
    const hashtagRegex = /#(\w+)/g;
    const foundHashtags = content.match(hashtagRegex)?.map(tag => tag.slice(1)) || [];
    setHashtags([...new Set(foundHashtags)]);

    // Extract mentions
    const mentionRegex = /@(\w+)/g;
    const foundMentions = content.match(mentionRegex)?.map(mention => mention.slice(1)) || [];
    setMentions([...new Set(foundMentions)]);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    // Basic URL validation
    if (url && !isValidVideoUrl(url)) {
      setError('Please enter a valid video URL (YouTube, Vimeo, etc.)');
    } else {
      setError(null);
    }
  };

  const isValidVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      const validDomains = [
        'youtube.com',
        'youtu.be',
        'vimeo.com',
        'dailymotion.com',
        'facebook.com',
        'instagram.com',
        'tiktok.com'
      ];
      return validDomains.some(domain => urlObj.hostname.includes(domain));
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!text.trim() && !videoUrl.trim()) {
      setError('Please add some content to your post');
      return;
    }

    setError(null);

    const postData = {
      content: {
        text: text.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        videoFile: videoFile || undefined,
        imageFile: imageFile || undefined,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
        mentions: mentions.length > 0 ? mentions : undefined
      },
      privacy,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined
    };

    try {
      const result = await createPostMutation.mutateAsync(postData);
      
      if (result.success && result.post) {
        onPostCreated?.(result.post.id || 'temp-id');
        
        // Reset form
        setText('');
        setVideoUrl('');
        setVideoFile(null);
        setImageFile(null);
        setPrivacy(PostPrivacy.PUBLIC);
        setScheduledFor('');
        setHashtags([]);
        setMentions([]);
      } else {
        setError(result.error || 'Failed to create post');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    }
  };

  const handleVideoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid video file (MP4, AVI, MOV, WMV, FLV, WebM)');
        return;
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size must be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      setError(null);
    }
  };

  const handleImageFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }
      
      setImageFile(file);
      setError(null);
    }
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  const removeImageFile = () => {
    setImageFile(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const characterCount = text.length;
  const maxCharacters = 10000;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Post</h3>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Text Content */}
        <div className="space-y-2">
          <TextArea
            ref={textAreaRef}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={maxCharacters}
          />
          
          {/* Character Count */}
          <div className="flex justify-between text-sm text-gray-500">
            <span>{characterCount} / {maxCharacters}</span>
            {isOverLimit && (
              <span className="text-red-500">Character limit exceeded</span>
            )}
          </div>
        </div>

        {/* Video URL Input */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Video URL</span>
          </div>
          <Input
            placeholder="Add a video URL (YouTube, Vimeo, etc.)"
            value={videoUrl}
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Upload Media</span>
          </div>
          
          {/* Video Upload */}
          <div className="space-y-2">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              className="w-full"
            >
              <Video className="h-4 w-4 mr-2" />
              Upload Video
            </Button>
            {videoFile && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-green-700">{videoFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeVideoFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            {imageFile && (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                <span className="text-sm text-green-700">{imageFile.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeImageFile}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Hashtags and Mentions */}
        {(hashtags.length > 0 || mentions.length > 0) && (
          <div className="space-y-2">
            {hashtags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Hashtags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {hashtags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {mentions.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Mentions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mentions.map((mention, index) => (
                                         <Badge key={index} variant="secondary">
                       @{mention}
                     </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Options */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-gray-600 hover:text-gray-800"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              {/* Privacy Setting */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Privacy</label>
                <Select
                  value={privacy}
                  onValueChange={(value) => setPrivacy(value as PostPrivacy)}
                >
                  {privacyOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <option key={option.value} value={option.value}>
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </option>
                    );
                  })}
                </Select>
              </div>

              {/* Schedule Post */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <label className="text-sm font-medium text-gray-700">Schedule Post</label>
                </div>
                <Input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={createPostMutation.isPending || isOverLimit || (!text.trim() && !videoUrl.trim())}
            className="min-w-[100px]"
          >
            {createPostMutation.isPending ? 'Creating...' : 'Post'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
