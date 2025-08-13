import { UserRoleValue, UserRole } from '../value-objects/UserRole'
import { UserStatusValue, UserStatus } from '../value-objects/UserStatus'

export interface UserProfile {
  displayName: string
  bio?: string
  avatar?: string
  coverImage?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
    emailNotifications: boolean
    pushNotifications: boolean
    privacyLevel: 'public' | 'friends' | 'private'
  }
}

export interface UserStats {
  postsCount: number
  followersCount: number
  followingCount: number
  likesReceived: number
  commentsCount: number
  productsCount: number
  ordersCount: number
  totalEarnings: number
  lastActiveAt: Date
}

export interface UserVerification {
  emailVerified: boolean
  phoneVerified: boolean
  identityVerified: boolean
  kycCompleted: boolean
  verificationDocuments?: string[]
  verificationStatus: 'pending' | 'approved' | 'rejected'
  verificationDate?: Date
  faceVerified: boolean
  faceId?: string
  faceEnrollmentDate?: Date
  faceVerificationEnabled: boolean
}

export interface UserMetadata {
  // Application-specific data stored in Clerk's private metadata
  role: string
  status: string
  profile: UserProfile
  stats: UserStats
  verification: UserVerification
  createdAt: string
  updatedAt: string
  lastLoginAt: string
  preferences: {
    marketingEmails: boolean
    dataSharing: boolean
    twoFactorEnabled: boolean
  }
  flags: {
    isCreator: boolean
    isSeller: boolean
    isVerified: boolean
    isPremium: boolean
  }
}

export class User {
  private readonly id: string
  private readonly email: string
  private readonly username: string
  private readonly role: UserRoleValue
  private readonly status: UserStatusValue
  private readonly profile: UserProfile
  private readonly stats: UserStats
  private readonly verification: UserVerification
  private readonly createdAt: Date
  private readonly updatedAt: Date
  private readonly lastLoginAt: Date

  constructor(
    id: string,
    email: string,
    username: string,
    role: UserRoleValue,
    status: UserStatusValue,
    profile: UserProfile,
    stats: UserStats,
    verification: UserVerification,
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date
  ) {
    this.id = id
    this.email = email
    this.username = username
    this.role = role
    this.status = status
    this.profile = profile
    this.stats = stats
    this.verification = verification
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.lastLoginAt = lastLoginAt
  }

  // Getters
  getId(): string {
    return this.id
  }

  getEmail(): string {
    return this.email
  }

  getUsername(): string {
    return this.username
  }

  getRole(): UserRoleValue {
    return this.role
  }

  getStatus(): UserStatusValue {
    return this.status
  }

  getProfile(): UserProfile {
    return { ...this.profile }
  }

  getStats(): UserStats {
    return { ...this.stats }
  }

  getVerification(): UserVerification {
    return { ...this.verification }
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt)
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt)
  }

  getLastLoginAt(): Date {
    return new Date(this.lastLoginAt)
  }

  // Business logic methods
  canPerformAction(action: string): boolean {
    return this.status.isActive() && this.role.hasPermission(action)
  }

  canAccessModule(module: string): boolean {
    return this.status.isActive() && this.role.canAccessModule(module)
  }

  isVerified(): boolean {
    return this.verification.identityVerified
  }

  isCreator(): boolean {
    return this.role.getValue() === 'creator'
  }

  isSeller(): boolean {
    return this.role.getValue() === 'seller'
  }

  isAdmin(): boolean {
    return this.role.getValue() === 'admin'
  }

  isModerator(): boolean {
    return this.role.getValue() === 'moderator'
  }

  canModerate(): boolean {
    return this.isAdmin() || this.isModerator()
  }

  canManageUsers(): boolean {
    return this.isAdmin()
  }

  canManageContent(): boolean {
    return this.isAdmin() || this.isModerator()
  }

  canAccessCreatorTools(): boolean {
    return this.isCreator() && this.status.isActive()
  }

  canAccessSellerTools(): boolean {
    return this.isSeller() && this.status.isActive()
  }

  // Factory method to create from Clerk user data
  static fromClerkUser(clerkUser: {
    id: string
    emailAddresses: Array<{ emailAddress: string }>
    username?: string
    privateMetadata?: UserMetadata
    createdAt: number
    updatedAt: number
    lastSignInAt?: number
  }): User {
    const metadata = clerkUser.privateMetadata as UserMetadata
    
    return new User(
      clerkUser.id,
      clerkUser.emailAddresses[0]?.emailAddress || '',
      clerkUser.username || '',
      new UserRoleValue((metadata?.role as UserRole) || UserRole.USER),
      new UserStatusValue((metadata?.status as UserStatus) || UserStatus.ACTIVE),
      metadata?.profile || this.getDefaultProfile(),
      metadata?.stats || this.getDefaultStats(),
      metadata?.verification || this.getDefaultVerification(),
      new Date(metadata?.createdAt || clerkUser.createdAt),
      new Date(metadata?.updatedAt || clerkUser.updatedAt),
      new Date(metadata?.lastLoginAt || (clerkUser.lastSignInAt || Date.now()))
    )
  }

  // Convert to Clerk metadata format
  toClerkMetadata(): UserMetadata {
    return {
      role: this.role.getValue(),
      status: this.status.getValue(),
      profile: this.profile,
      stats: this.stats,
      verification: this.verification,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastLoginAt: this.lastLoginAt.toISOString(),
      preferences: {
        marketingEmails: true,
        dataSharing: false,
        twoFactorEnabled: false
      },
      flags: {
        isCreator: this.isCreator(),
        isSeller: this.isSeller(),
        isVerified: this.isVerified(),
        isPremium: false
      }
    }
  }

  // Default values
  private static getDefaultProfile(): UserProfile {
    return {
      displayName: '',
      bio: '',
      avatar: '',
      coverImage: '',
      location: '',
      website: '',
      socialLinks: {},
      preferences: {
        theme: 'system',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: true,
        privacyLevel: 'public'
      }
    }
  }

  private static getDefaultStats(): UserStats {
    return {
      postsCount: 0,
      followersCount: 0,
      followingCount: 0,
      likesReceived: 0,
      commentsCount: 0,
      productsCount: 0,
      ordersCount: 0,
      totalEarnings: 0,
      lastActiveAt: new Date()
    }
  }

  private static getDefaultVerification(): UserVerification {
    return {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      kycCompleted: false,
      verificationDocuments: [],
      verificationStatus: 'pending',
      faceVerified: false,
      faceVerificationEnabled: false
    }
  }
} 