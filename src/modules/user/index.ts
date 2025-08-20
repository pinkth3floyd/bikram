// Domain exports
export { User } from '../../core/domain/entities/User'
export { UserRole, UserRoleValue, ROLE_PERMISSIONS } from '../../core/domain/value-objects/UserRole'
export { UserStatus, UserStatusValue } from '../../core/domain/value-objects/UserStatus'
export type { UserRepository } from '../../core/domain/repositories/UserRepository'

// Infrastructure exports
export { ClerkUserRepository } from '../../core/infrastructure/auth/ClerkUserRepository'

// Application exports
export { CreateUserUseCase } from '../../core/application/use-cases/CreateUserUseCase'
export { GetUserProfileUseCase } from '../../core/application/use-cases/GetUserProfileUseCase'
export * from '../../core/application/dto/UserDto'

// Service exports
export { UserService } from './UserService'

// Hook exports
export * from './hooks/useUser'


// Component exports
export { UserProfile } from './components/UserProfile'
export { CustomSignUp } from './components/CustomSignUp'
export { CustomSignIn } from './components/CustomSignIn'

export { ClientOnly } from './components/ClientOnly'


// Type exports
export type {
  UserProfile as UserProfileType,
  UserStats as UserStatsType,
  UserVerification as UserVerificationType,
  UserMetadata as UserMetadataType
} from '../../core/domain/entities/User' 