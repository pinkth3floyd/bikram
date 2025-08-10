'use client'

import React, { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

import { Button } from '../../../app/core/ui/elements/Button'
import { Input } from '../../../app/core/ui/elements/Input'
import { Label } from '../../../app/core/ui/elements/Label'
import { useCreateUser } from '../hooks/useUser'
import { CreateUserDto } from '../../../core/application/dto/UserDto'
import { UserRole } from '../../../core/domain/value-objects/UserRole'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface CustomSignUpProps {
  onSuccess?: () => void
}

export const CustomSignUp: React.FC<CustomSignUpProps> = ({ onSuccess }) => {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const createUserMutation = useCreateUser()
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Create user in Clerk
      const result = await signUp?.create({
        emailAddress: formData.email,
        password: formData.password,
      })

      if (result?.status === 'complete') {
        // Set the user session
        if (setActive) {
          await setActive({ session: result.createdSessionId })
        }

        // Create user in our application
        const userDto: CreateUserDto = {
          email: formData.email,
          username: formData.username,
          displayName: formData.displayName,
          role: UserRole.USER
        }

        await createUserMutation.mutateAsync(userDto)

        // Redirect to profile page
        router.push('/profile')
        
        if (onSuccess) {
          onSuccess()
        }
      } else if (result?.status === 'missing_requirements') {
        // Handle additional requirements like username
        if (result.verifications?.emailAddress?.status === 'verified') {
          // Update username if needed
          if (formData.username && signUp?.update) {
            await signUp.update({
              username: formData.username
            })
          }
          
          // Create user in our application
          const userDto: CreateUserDto = {
            email: formData.email,
            username: formData.username,
            displayName: formData.displayName,
            role: UserRole.USER
          }

          await createUserMutation.mutateAsync(userDto)

          // Redirect to profile page
          router.push('/profile')
          
          if (onSuccess) {
            onSuccess()
          }
        } else {
          // Email verification required
          setErrors({ general: 'Please check your email and verify your account before continuing.' })
        }
      } else {
        console.error('Sign up failed:', result)
        setErrors({ general: 'Sign up failed. Please try again.' })
      }
    } catch (error: unknown) {
      console.error('Sign up error:', error)
      
      const errorObj = error as { errors?: Array<{ code: string }>; message?: string }
      if (errorObj.errors?.[0]?.code === 'form_identifier_exists') {
        setErrors({ email: 'An account with this email already exists' })
      } else if (errorObj.errors?.[0]?.code === 'form_username_exists') {
        setErrors({ username: 'This username is already taken' })
      } else {
        setErrors({ general: errorObj.message || 'Something went wrong. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CAPTCHA Element for Clerk */}
      <div id="clerk-captcha"></div>
      
      {/* General Error */}
      {errors.general && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700 dark:text-red-400 text-sm">{errors.general}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Choose a username"
          className={errors.username ? 'border-red-500 focus:border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.username}
          </p>
        )}
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          value={formData.displayName}
          onChange={handleInputChange}
          placeholder="Enter your display name"
          className={errors.displayName ? 'border-red-500 focus:border-red-500' : ''}
          disabled={isSubmitting}
        />
        {errors.displayName && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.displayName}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            className={errors.password ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={errors.confirmPassword ? 'border-red-500 focus:border-red-500 pr-10' : 'pr-10'}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Create Account
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="text-purple-600 hover:text-purple-700 underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
          Privacy Policy
        </a>
      </p>
    </form>
  )
} 