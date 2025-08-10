import { UserRole } from '../../domain/value-objects/UserRole'
import { UserStatus } from '../../domain/value-objects/UserStatus'

export interface CreateUserDto {
  email: string
  username: string
  role?: UserRole
  displayName?: string
  bio?: string
}

export interface UpdateUserDto {
  username?: string
  displayName?: string
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
  preferences?: {
    theme?: 'light' | 'dark' | 'system'
    language?: string
    timezone?: string
    emailNotifications?: boolean
    pushNotifications?: boolean
    privacyLevel?: 'public' | 'friends' | 'private'
  }
}

export interface UpdateUserRoleDto {
  userId: string
  role: UserRole
  updatedBy: string
  reason?: string
}

export interface UpdateUserStatusDto {
  userId: string
  status: UserStatus
  updatedBy: string
  reason?: string
  duration?: number // For suspensions
}

export interface UserProfileDto {
  id: string
  username: string
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
  stats: {
    postsCount: number
    followersCount: number
    followingCount: number
    likesReceived: number
  }
  isVerified: boolean
  isFollowing?: boolean
  canFollow?: boolean
  createdAt: string
}

export interface UserAdminDto {
  id: string
  email: string
  username: string
  displayName: string
  role: UserRole
  status: UserStatus
  isVerified: boolean
  lastLoginAt: string
  createdAt: string
  updatedAt: string
  stats: {
    postsCount: number
    followersCount: number
    followingCount: number
    totalEarnings: number
  }
}

export interface UserSearchDto {
  query: string
  page?: number
  limit?: number
  filters?: {
    role?: UserRole
    status?: UserStatus
    isVerified?: boolean
  }
}

export interface UserListDto {
  users: UserProfileDto[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface UserStatsDto {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  usersByRole: Record<UserRole, number>
  usersByStatus: Record<UserStatus, number>
  verificationStats: {
    verified: number
    pending: number
    rejected: number
  }
} 