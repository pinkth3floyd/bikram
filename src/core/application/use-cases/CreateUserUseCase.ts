import { User } from '../../domain/entities/User'
import { UserRepository } from '../../domain/repositories/UserRepository'
import { UserRoleValue, UserRole } from '../../domain/value-objects/UserRole'
import { UserStatusValue, UserStatus } from '../../domain/value-objects/UserStatus'
import { CreateUserDto } from '../dto/UserDto'

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Validate input
    this.validateCreateUserDto(dto)

    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(dto.email)
    if (existingUserByEmail) {
      throw new Error('User with this email already exists')
    }

    const existingUserByUsername = await this.userRepository.findByUsername(dto.username)
    if (existingUserByUsername) {
      throw new Error('Username is already taken')
    }

    // Create user entity
    const user = this.createUserEntity(dto)

    // Save to repository
    const createdUser = await this.userRepository.create(user)

    return createdUser
  }

  private validateCreateUserDto(dto: CreateUserDto): void {
    if (!dto.email || !dto.email.includes('@')) {
      throw new Error('Valid email is required')
    }

    if (!dto.username || dto.username.length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }

    if (dto.username.length > 30) {
      throw new Error('Username must be less than 30 characters')
    }

    // Username validation regex
    const usernameRegex = /^[a-zA-Z0-9_]+$/
    if (!usernameRegex.test(dto.username)) {
      throw new Error('Username can only contain letters, numbers, and underscores')
    }
  }

  private createUserEntity(dto: CreateUserDto): User {
    const role = new UserRoleValue(dto.role || UserRole.USER)
    const status = new UserStatusValue(UserStatus.ACTIVE)

    const profile = {
      displayName: dto.displayName || dto.username,
      bio: dto.bio || '',
      avatar: '',
      coverImage: '',
      location: '',
      website: '',
      socialLinks: {},
      preferences: {
        theme: 'system' as const,
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: true,
        privacyLevel: 'public' as const
      }
    }

    const stats = {
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

    const verification = {
      emailVerified: false,
      phoneVerified: false,
      identityVerified: false,
      kycCompleted: false,
      verificationDocuments: [],
      verificationStatus: 'pending' as const,
      faceVerified: false,
      faceVerificationEnabled: false
    }

    const now = new Date()

    return new User(
      dto.id || '', // Use provided ID or empty string
      dto.email,
      dto.username,
      role,
      status,
      profile,
      stats,
      verification,
      now,
      now,
      now
    )
  }
} 