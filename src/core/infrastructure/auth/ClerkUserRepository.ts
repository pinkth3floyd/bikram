import { User, UserMetadata } from '../../domain/entities/User'
import { UserRepository } from '../../domain/repositories/UserRepository'
import { UserRole } from '../../domain/value-objects/UserRole'
import { UserStatus } from '../../domain/value-objects/UserStatus'

// Mock implementation for demonstration purposes
// In a real implementation, this would use the actual Clerk client
export class ClerkUserRepository implements UserRepository {
  private mockUsers: Map<string, {
    id: string
    emailAddresses: Array<{ emailAddress: string }>
    username: string
    privateMetadata: UserMetadata
    createdAt: number
    updatedAt: number
    lastSignInAt: number
  }> = new Map()

  constructor() {
    // Initialize with some mock users
    this.initializeMockUsers()
  }

  private initializeMockUsers() {
    const mockUserData = {
      id: 'user_123',
      emailAddresses: [{ emailAddress: 'user@example.com' }],
      username: 'demo_user',
      privateMetadata: {
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        profile: {
          displayName: 'Demo User',
          bio: 'This is a demo user',
          avatar: '',
          coverImage: '',
          location: 'San Francisco, CA',
          website: 'https://example.com',
          socialLinks: {
            twitter: 'https://twitter.com/demouser',
            instagram: 'https://instagram.com/demouser'
          },
          preferences: {
            theme: 'system' as const,
            language: 'en',
            timezone: 'UTC',
            emailNotifications: true,
            pushNotifications: true,
            privacyLevel: 'public' as const
          }
        },
        stats: {
          postsCount: 15,
          followersCount: 120,
          followingCount: 85,
          likesReceived: 450,
          commentsCount: 67,
          productsCount: 0,
          ordersCount: 0,
          totalEarnings: 0,
          lastActiveAt: new Date()
        },
        verification: {
          emailVerified: true,
          phoneVerified: false,
          identityVerified: false,
          kycCompleted: false,
          verificationDocuments: [],
          verificationStatus: 'pending' as const
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          marketingEmails: true,
          dataSharing: false,
          twoFactorEnabled: false
        },
        flags: {
          isCreator: false,
          isSeller: false,
          isVerified: false,
          isPremium: false
        }
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastSignInAt: Date.now()
    }

    this.mockUsers.set('user_123', mockUserData)
  }

  async findById(id: string): Promise<User | null> {
    try {
      const mockClerkUser = this.mockUsers.get(id)
      if (!mockClerkUser) return null
      
      return User.fromClerkUser(mockClerkUser)
    } catch (error) {
      console.error('Error finding user by ID:', error)
      return null
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Mock implementation - find by email
      for (const [, user] of this.mockUsers) {
        if (user.emailAddresses[0]?.emailAddress === email) {
          return User.fromClerkUser(user)
        }
      }
      return null
    } catch (error) {
      console.error('Error finding user by email:', error)
      return null
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      // Mock implementation - find by username
      for (const [, user] of this.mockUsers) {
        if (user.username === username) {
          return User.fromClerkUser(user)
        }
      }
      return null
    } catch (error) {
      console.error('Error finding user by username:', error)
      return null
    }
  }

  async create(user: User): Promise<User> {
    try {
      const mockClerkUser = {
        id: user.getId(),
        emailAddresses: [{ emailAddress: user.getEmail() }],
        username: user.getUsername(),
        privateMetadata: user.toClerkMetadata(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastSignInAt: Date.now()
      }
      
      this.mockUsers.set(user.getId(), mockClerkUser)
      return user
    } catch (error) {
      console.error('Error creating user:', error)
      throw new Error('Failed to create user')
    }
  }

  async update(user: User): Promise<User> {
    try {
      const mockClerkUser = {
        id: user.getId(),
        emailAddresses: [{ emailAddress: user.getEmail() }],
        username: user.getUsername(),
        privateMetadata: user.toClerkMetadata(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastSignInAt: Date.now()
      }
      
      this.mockUsers.set(user.getId(), mockClerkUser)
      return user
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.mockUsers.delete(id)
    } catch (error) {
      console.error('Error deleting user:', error)
      throw new Error('Failed to delete user')
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values()).map(user => User.fromClerkUser(user))
    } catch (error) {
      console.error('Error finding all users:', error)
      return []
    }
  }

  async findByRole(role: UserRole): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.getRole().getValue() === role)
    } catch (error) {
      console.error('Error finding users by role:', error)
      return []
    }
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.getStatus().getValue() === status)
    } catch (error) {
      console.error('Error finding users by status:', error)
      return []
    }
  }

  async findByModuleAccess(module: string): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.canAccessModule(module))
    } catch (error) {
      console.error('Error finding users by module access:', error)
      return []
    }
  }

  async search(query: string): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => 
          user.getUsername().toLowerCase().includes(query.toLowerCase()) ||
          user.getEmail().toLowerCase().includes(query.toLowerCase()) ||
          user.getProfile().displayName.toLowerCase().includes(query.toLowerCase())
        )
    } catch (error) {
      console.error('Error searching users:', error)
      return []
    }
  }

  async findUsersWithPermission(permission: string): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.canPerformAction(permission))
    } catch (error) {
      console.error('Error finding users with permission:', error)
      return []
    }
  }

  async getTotalUsers(): Promise<number> {
    try {
      return this.mockUsers.size
    } catch (error) {
      console.error('Error getting total users:', error)
      return 0
    }
  }

  async getUsersByRole(): Promise<Record<UserRole, number>> {
    try {
      const users = Array.from(this.mockUsers.values()).map(user => User.fromClerkUser(user))
      
      const roleCounts: Record<UserRole, number> = {
        [UserRole.USER]: 0,
        [UserRole.MODERATOR]: 0,
        [UserRole.ADMIN]: 0,
        [UserRole.CREATOR]: 0,
        [UserRole.SELLER]: 0,
        [UserRole.BUYER]: 0
      }
      
      users.forEach(user => {
        const role = user.getRole().getValue()
        roleCounts[role]++
      })
      
      return roleCounts
    } catch (error) {
      console.error('Error getting users by role:', error)
      return {
        [UserRole.USER]: 0,
        [UserRole.MODERATOR]: 0,
        [UserRole.ADMIN]: 0,
        [UserRole.CREATOR]: 0,
        [UserRole.SELLER]: 0,
        [UserRole.BUYER]: 0
      }
    }
  }

  async getUsersByStatus(): Promise<Record<UserStatus, number>> {
    try {
      const users = Array.from(this.mockUsers.values()).map(user => User.fromClerkUser(user))
      
      const statusCounts: Record<UserStatus, number> = {
        [UserStatus.ACTIVE]: 0,
        [UserStatus.INACTIVE]: 0,
        [UserStatus.SUSPENDED]: 0,
        [UserStatus.BANNED]: 0,
        [UserStatus.PENDING_VERIFICATION]: 0
      }
      
      users.forEach(user => {
        const status = user.getStatus().getValue()
        statusCounts[status]++
      })
      
      return statusCounts
    } catch (error) {
      console.error('Error getting users by status:', error)
      return {
        [UserStatus.ACTIVE]: 0,
        [UserStatus.INACTIVE]: 0,
        [UserStatus.SUSPENDED]: 0,
        [UserStatus.BANNED]: 0,
        [UserStatus.PENDING_VERIFICATION]: 0
      }
    }
  }

  async findWithPagination(page: number, limit: number): Promise<{
    users: User[]
    total: number
    page: number
    totalPages: number
  }> {
    try {
      const allUsers = Array.from(this.mockUsers.values()).map(user => User.fromClerkUser(user))
      const total = allUsers.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedUsers = allUsers.slice(startIndex, endIndex)
      
      return {
        users: paginatedUsers,
        total,
        page,
        totalPages
      }
    } catch (error) {
      console.error('Error finding users with pagination:', error)
      return {
        users: [],
        total: 0,
        page,
        totalPages: 0
      }
    }
  }

  async updateMany(ids: string[]): Promise<void> {
    try {
      // Mock implementation - no actual update needed
      console.log('Mock updateMany called for ids:', ids)
    } catch (error) {
      console.error('Error updating many users:', error)
      throw new Error('Failed to update users')
    }
  }

  async deleteMany(ids: string[]): Promise<void> {
    try {
      for (const id of ids) {
        this.mockUsers.delete(id)
      }
    } catch (error) {
      console.error('Error deleting many users:', error)
      throw new Error('Failed to delete users')
    }
  }

  async findPendingVerifications(): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.getStatus().requiresVerification())
    } catch (error) {
      console.error('Error finding pending verifications:', error)
      return []
    }
  }

  async findVerifiedUsers(): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => user.isVerified())
    } catch (error) {
      console.error('Error finding verified users:', error)
      return []
    }
  }

  async getActiveUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => {
          const lastLogin = user.getLastLoginAt()
          return lastLogin >= startDate && lastLogin <= endDate && user.getStatus().isActive()
        })
    } catch (error) {
      console.error('Error getting active users in period:', error)
      return []
    }
  }

  async getNewUsersInPeriod(startDate: Date, endDate: Date): Promise<User[]> {
    try {
      return Array.from(this.mockUsers.values())
        .map(user => User.fromClerkUser(user))
        .filter(user => {
          const createdAt = user.getCreatedAt()
          return createdAt >= startDate && createdAt <= endDate
        })
    } catch (error) {
      console.error('Error getting new users in period:', error)
      return []
    }
  }
} 