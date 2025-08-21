import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import { getUserRepository } from '../init';

// Import UserMetadata type from User entity
type UserMetadata = {
  role: string;
  status: string;
  profile: {
    displayName: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    location?: string;
    website?: string;
    socialLinks?: Record<string, unknown>;
    preferences: {
      theme: 'light' | 'dark' | 'system';
      language: string;
      timezone: string;
      emailNotifications: boolean;
      pushNotifications: boolean;
      privacyLevel: 'public' | 'friends' | 'private';
    };
  };
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
    likesReceived: number;
    commentsCount: number;
    productsCount: number;
    ordersCount: number;
    totalEarnings: number;
    lastActiveAt: Date;
  };
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    identityVerified: boolean;
    kycCompleted: boolean;
    verificationDocuments?: string[];
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationDate?: Date;
    faceVerified: boolean;
    faceId?: string;
    faceEnrollmentDate?: Date;
    faceVerificationEnabled: boolean;
  };
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  preferences: {
    marketingEmails: boolean;
    dataSharing: boolean;
    twoFactorEnabled: boolean;
  };
  flags: {
    isCreator: boolean;
    isSeller: boolean;
    isVerified: boolean;
    isPremium: boolean;
  };
};

/**
 * Adapter to integrate Clerk user management with the database
 * This allows us to sync Clerk user data with our local database
 */
export class ClerkUserRepositoryAdapter {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = getUserRepository();
  }

  /**
   * Sync a Clerk user to the database
   */
  async syncUserFromClerk(clerkUser: {
    id: string;
    emailAddresses: Array<{ emailAddress: string }>;
    username?: string;
    privateMetadata?: UserMetadata;
    createdAt: number;
    updatedAt: number;
    lastSignInAt?: number;
  }): Promise<User> {
    try {
      // Convert Clerk user to domain User entity
      const user = User.fromClerkUser(clerkUser);

      // Check if user already exists in database
      const existingUser = await this.userRepository.findById(user.getId());

      if (existingUser) {
        // Update existing user
        return await this.userRepository.update(user);
      } else {
        // Create new user
        return await this.userRepository.create(user);
      }
    } catch (error) {
      console.error('Error syncing user from Clerk:', error);
      throw new Error('Failed to sync user from Clerk');
    }
  }

  /**
   * Get user from database by Clerk ID
   */
  async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      return await this.userRepository.findById(clerkId);
    } catch (error) {
      console.error('Error getting user by Clerk ID:', error);
      return null;
    }
  }

  /**
   * Update user verification status in database
   */
  async updateUserVerification(clerkId: string, verificationData: {
    faceVerified?: boolean;
    faceId?: string;
    faceVerificationEnabled?: boolean;
  }): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(clerkId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update verification data
      const verification = user.getVerification();
      const updatedVerification = {
        ...verification,
        ...verificationData
      };

      // Create updated user entity
      const updatedUser = new User(
        user.getId(),
        user.getEmail(),
        user.getUsername(),
        user.getRole(),
        user.getStatus(),
        user.getProfile(),
        user.getStats(),
        updatedVerification,
        user.getCreatedAt(),
        new Date(), // Update timestamp
        user.getLastLoginAt()
      );

      return await this.userRepository.update(updatedUser);
    } catch (error) {
      console.error('Error updating user verification:', error);
      return null;
    }
  }

  /**
   * Update user profile in database
   */
  async updateUserProfile(clerkId: string, profileData: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    coverImage?: string;
    location?: string;
    website?: string;
    socialLinks?: Record<string, unknown>;
  }): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(clerkId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update profile data
      const profile = user.getProfile();
      const updatedProfile = {
        ...profile,
        ...profileData
      };

      // Create updated user entity
      const updatedUser = new User(
        user.getId(),
        user.getEmail(),
        user.getUsername(),
        user.getRole(),
        user.getStatus(),
        updatedProfile,
        user.getStats(),
        user.getVerification(),
        user.getCreatedAt(),
        new Date(), // Update timestamp
        user.getLastLoginAt()
      );

      return await this.userRepository.update(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  /**
   * Update user statistics in database
   */
  async updateUserStats(clerkId: string, statsData: {
    postsCount?: number;
    followersCount?: number;
    followingCount?: number;
    likesReceived?: number;
    commentsCount?: number;
    productsCount?: number;
    ordersCount?: number;
    totalEarnings?: number;
    lastActiveAt?: Date;
  }): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(clerkId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update stats data
      const stats = user.getStats();
      const updatedStats = {
        ...stats,
        ...statsData
      };

      // Create updated user entity
      const updatedUser = new User(
        user.getId(),
        user.getEmail(),
        user.getUsername(),
        user.getRole(),
        user.getStatus(),
        user.getProfile(),
        updatedStats,
        user.getVerification(),
        user.getCreatedAt(),
        new Date(), // Update timestamp
        user.getLastLoginAt()
      );

      return await this.userRepository.update(updatedUser);
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  }

  /**
   * Delete user from database (when deleted from Clerk)
   */
  async deleteUser(clerkId: string): Promise<boolean> {
    try {
      await this.userRepository.delete(clerkId);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  /**
   * Get all users from database
   */
  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Search users in database
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      return await this.userRepository.search(query);
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}
