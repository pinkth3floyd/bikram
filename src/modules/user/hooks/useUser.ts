'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useUser as useClerkUser } from '@clerk/nextjs'
import { UserService } from '../UserService'
import { ClerkUserRepository } from '../../../core/infrastructure/auth/ClerkUserRepository'
import { 
  CreateUserDto, 
  UserSearchDto
} from '../../../core/application/dto/UserDto'

// Initialize services
const userRepository = new ClerkUserRepository()
const userService = new UserService(userRepository)

// Query keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: (id: string) => [...userKeys.details(), id, 'profile'] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
  search: (query: string) => [...userKeys.all, 'search', query] as const,
}

// Hook for current user
export const useCurrentUser = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useClerkUser()
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: userKeys.detail(clerkUser?.id || ''),
    queryFn: () => userService.getUserById(clerkUser!.id),
    enabled: isLoaded && isSignedIn && !!clerkUser?.id,
  })

  return {
    user,
    isLoading: !isLoaded || isLoading,
    isSignedIn,
    error
  }
}

// Hook for user profile
export const useUserProfile = (userId: string, requestingUserId?: string) => {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userService.getUserProfile(userId, requestingUserId),
    enabled: !!userId,
  })
}

// Hook for user by ID
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userService.getUserById(userId),
    enabled: !!userId,
  })
}

// Hook for user by username
export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: userKeys.detail(`username:${username}`),
    queryFn: () => userService.getUserByUsername(username),
    enabled: !!username,
  })
}

// Hook for user search
export const useUserSearch = (searchDto: UserSearchDto) => {
  return useQuery({
    queryKey: userKeys.search(searchDto.query),
    queryFn: () => userService.searchUsers(searchDto),
    enabled: !!searchDto.query && searchDto.query.length >= 2,
  })
}

// Hook for user list with pagination
export const useUserList = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: userKeys.list(`page:${page},limit:${limit}`),
    queryFn: () => userService.getUsersWithPagination(page, limit),
  })
}

// Hook for user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
  })
}

// Hook for permission checking
export const useUserPermission = (userId: string, action: string) => {
  return useQuery({
    queryKey: [...userKeys.detail(userId), 'permission', action],
    queryFn: () => userService.canUserPerformAction(userId, action),
    enabled: !!userId && !!action,
  })
}

// Hook for module access checking
export const useUserModuleAccess = (userId: string, module: string) => {
  return useQuery({
    queryKey: [...userKeys.detail(userId), 'module-access', module],
    queryFn: () => userService.canUserAccessModule(userId, module),
    enabled: !!userId && !!module,
  })
}

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (dto: CreateUserDto) => userService.createUser(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => userService.updateUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => userService.updateUserRole(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => userService.updateUserStatus(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userKeys.stats() })
    },
  })
}

// Utility hooks
export const useUserPermissions = (userId: string) => {
  const { data: user } = useUser(userId)
  
  return {
    canPost: user?.canPerformAction('create:own_posts') || false,
    canComment: user?.canPerformAction('create:comments') || false,
    canModerate: user?.canModerate() || false,
    canManageUsers: user?.canManageUsers() || false,
    canAccessCreatorTools: user?.canAccessCreatorTools() || false,
    canAccessSellerTools: user?.canAccessSellerTools() || false,
    isVerified: user?.isVerified() || false,
    isActive: user?.getStatus().isActive() || false,
  }
}

export const useUserRole = (userId: string) => {
  const { data: user } = useUser(userId)
  
  return {
    role: user?.getRole().getValue(),
    permissions: user?.getRole().getPermissions() || [],
    isAdmin: user?.isAdmin() || false,
    isModerator: user?.isModerator() || false,
    isCreator: user?.isCreator() || false,
    isSeller: user?.isSeller() || false,
  }
} 