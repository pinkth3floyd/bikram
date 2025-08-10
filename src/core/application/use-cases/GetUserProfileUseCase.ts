import { UserRepository } from '../../domain/repositories/UserRepository'
import { UserProfileDto } from '../dto/UserDto'

export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, requestingUserId?: string): Promise<UserProfileDto> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Check if user is active
    if (!user.getStatus().isActive()) {
      throw new Error('User profile is not available')
    }

    const profile = user.getProfile()
    const stats = user.getStats()

    return {
      id: user.getId(),
      username: user.getUsername(),
      displayName: profile.displayName,
      bio: profile.bio,
      avatar: profile.avatar,
      coverImage: profile.coverImage,
      location: profile.location,
      website: profile.website,
      socialLinks: profile.socialLinks,
      stats: {
        postsCount: stats.postsCount,
        followersCount: stats.followersCount,
        followingCount: stats.followingCount,
        likesReceived: stats.likesReceived
      },
      isVerified: user.isVerified(),
      isFollowing: false, // TODO: Implement following logic
      canFollow: requestingUserId !== userId, // Can't follow yourself
      createdAt: user.getCreatedAt().toISOString()
    }
  }
} 