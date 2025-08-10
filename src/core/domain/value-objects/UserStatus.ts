export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING_VERIFICATION = 'pending_verification'
}

export const USER_STATUSES = Object.values(UserStatus) as UserStatus[]

export class UserStatusValue {
  private readonly value: UserStatus

  constructor(status: UserStatus) {
    if (!USER_STATUSES.includes(status)) {
      throw new Error(`Invalid user status: ${status}`)
    }
    this.value = status
  }

  getValue(): UserStatus {
    return this.value
  }

  isActive(): boolean {
    return this.value === UserStatus.ACTIVE
  }

  canPost(): boolean {
    return this.value === UserStatus.ACTIVE
  }

  canComment(): boolean {
    return this.value === UserStatus.ACTIVE
  }

  canAccessMarketplace(): boolean {
    return this.value === UserStatus.ACTIVE
  }

  requiresVerification(): boolean {
    return this.value === UserStatus.PENDING_VERIFICATION
  }

  isBanned(): boolean {
    return this.value === UserStatus.BANNED
  }

  isSuspended(): boolean {
    return this.value === UserStatus.SUSPENDED
  }

  equals(other: UserStatusValue): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
} 