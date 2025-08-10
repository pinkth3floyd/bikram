export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  CREATOR = 'creator',
  SELLER = 'seller',
  BUYER = 'buyer'
}

export const USER_ROLES = Object.values(UserRole) as UserRole[]

const USER_PERMISSIONS = [
  'read:own_posts',
  'create:own_posts',
  'update:own_posts',
  'delete:own_posts',
  'read:public_posts',
  'create:comments',
  'update:own_comments',
  'delete:own_comments',
  'like:posts',
  'share:posts',
  'read:own_profile',
  'update:own_profile',
  'read:marketplace',
  'create:orders',
  'read:own_orders'
]

const MODERATOR_PERMISSIONS = [
  ...USER_PERMISSIONS,
  'moderate:posts',
  'moderate:comments',
  'moderate:users',
  'read:reports',
  'action:reports',
  'ban:users',
  'unban:users'
]

const ADMIN_PERMISSIONS = [
  ...MODERATOR_PERMISSIONS,
  'manage:roles',
  'manage:permissions',
  'manage:system_settings',
  'view:analytics',
  'manage:content',
  'delete:any_posts',
  'delete:any_comments',
  'manage:marketplace'
]

const CREATOR_PERMISSIONS = [
  ...USER_PERMISSIONS,
  'create:premium_content',
  'monetize:content',
  'access:creator_tools',
  'view:content_analytics'
]

const SELLER_PERMISSIONS = [
  ...USER_PERMISSIONS,
  'create:products',
  'update:own_products',
  'delete:own_products',
  'manage:own_store',
  'view:sales_analytics',
  'process:orders'
]

const BUYER_PERMISSIONS = [
  ...USER_PERMISSIONS,
  'purchase:products',
  'review:products',
  'return:products',
  'view:purchase_history'
]

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.USER]: USER_PERMISSIONS,
  [UserRole.MODERATOR]: MODERATOR_PERMISSIONS,
  [UserRole.ADMIN]: ADMIN_PERMISSIONS,
  [UserRole.CREATOR]: CREATOR_PERMISSIONS,
  [UserRole.SELLER]: SELLER_PERMISSIONS,
  [UserRole.BUYER]: BUYER_PERMISSIONS
}

export class UserRoleValue {
  private readonly value: UserRole

  constructor(role: UserRole) {
    if (!USER_ROLES.includes(role)) {
      throw new Error(`Invalid user role: ${role}`)
    }
    this.value = role
  }

  getValue(): UserRole {
    return this.value
  }

  getPermissions(): string[] {
    return ROLE_PERMISSIONS[this.value]
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions().includes(permission)
  }

  canAccessModule(module: string): boolean {
    const modulePermissions = this.getPermissions().filter(p => p.startsWith(`${module}:`))
    return modulePermissions.length > 0
  }

  equals(other: UserRoleValue): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
} 