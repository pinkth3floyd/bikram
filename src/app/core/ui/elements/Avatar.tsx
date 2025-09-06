import React from 'react';
import Image from 'next/image';
import { cn } from './ClassnameUtil';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  fallback,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg'
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (src && !imageError) {
    return (
      <Image
        src={src}
        alt={alt || 'Avatar'}
        width={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
        height={size === 'sm' ? 32 : size === 'md' ? 40 : size === 'lg' ? 48 : 64}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className
        )}
        onError={handleImageError}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600',
        sizeClasses[size],
        className
      )}
    >
      {fallback ? fallback.charAt(0).toUpperCase() : 'U'}
    </div>
  );
};
