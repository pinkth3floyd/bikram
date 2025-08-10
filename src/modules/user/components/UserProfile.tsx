'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../app/core/ui/elements/Card'
import { Button } from '../../../app/core/ui/elements/Button'
import { Badge } from '../../../app/core/ui/elements/Badge'
import { useUserProfile, useUserPermissions, useUserRole } from '../hooks/useUser'
import { User, Shield, Crown, Star, Users, MapPin, Globe, Calendar } from 'lucide-react'

interface UserProfileProps {
  userId: string
  requestingUserId?: string
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, requestingUserId }) => {
  const { data: profile, isLoading, error } = useUserProfile(userId, requestingUserId)
  const permissions = useUserPermissions(userId)
  const roleInfo = useUserRole(userId)

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <User className="w-12 h-12 mx-auto mb-2" />
            <p>Error loading user profile</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500 mb-4">
            <User className="w-12 h-12 mx-auto mb-2" />
            <p>User not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getRoleIcon = () => {
    switch (roleInfo?.role) {
      case 'admin':
        return <Crown className="w-4 h-4" />
      case 'moderator':
        return <Shield className="w-4 h-4" />
      case 'creator':
        return <Star className="w-4 h-4" />
      case 'seller':
        return <Users className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = () => {
    switch (roleInfo?.role) {
      case 'admin':
        return 'bg-red-500 text-white'
      case 'moderator':
        return 'bg-blue-500 text-white'
      case 'creator':
        return 'bg-purple-500 text-white'
      case 'seller':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
          {profile.isVerified && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
              <Star className="w-4 h-4" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold">{profile.displayName}</CardTitle>
        <p className="text-gray-600">@{profile.username}</p>
        {profile.bio && (
          <p className="text-gray-700 mt-2">{profile.bio}</p>
        )}
        
        <div className="flex justify-center gap-2 mt-4">
          <Badge className={getRoleColor()}>
            <div className="flex items-center gap-1">
              {getRoleIcon()}
              {roleInfo?.role}
            </div>
          </Badge>
          {profile.isVerified && (
            <Badge className="bg-blue-500 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                Verified
              </div>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">{profile.stats.postsCount}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{profile.stats.followersCount}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{profile.stats.followingCount}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{profile.stats.likesReceived}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
        </div>

        {/* Location and Website */}
        {(profile.location || profile.website) && (
          <div className="space-y-2">
            {profile.location && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Social Links</h4>
            <div className="flex gap-2">
              {profile.socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </Button>
              )}
              {profile.socialLinks.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram
                  </a>
                </Button>
              )}
              {profile.socialLinks.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        {profile.canFollow && (
          <div className="flex gap-2">
            <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Follow
            </Button>
            <Button variant="outline" className="flex-1">
              Message
            </Button>
          </div>
        )}

        {/* Permissions Display (for debugging) */}
        {permissions && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Permissions</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Can Post: {permissions.canPost ? '✅' : '❌'}</div>
              <div>Can Comment: {permissions.canComment ? '✅' : '❌'}</div>
              <div>Can Moderate: {permissions.canModerate ? '✅' : '❌'}</div>
              <div>Can Manage Users: {permissions.canManageUsers ? '✅' : '❌'}</div>
              <div>Creator Tools: {permissions.canAccessCreatorTools ? '✅' : '❌'}</div>
              <div>Seller Tools: {permissions.canAccessSellerTools ? '✅' : '❌'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 