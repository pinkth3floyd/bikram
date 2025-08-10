'use client'

import React, { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '../../../app/core/ui/elements/Button'
import { Input } from '../../../app/core/ui/elements/Input'
import { Label } from '../../../app/core/ui/elements/Label'
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from 'lucide-react'

interface CustomSignInProps {
  onSuccess?: () => void
}

export const CustomSignIn: React.FC<CustomSignInProps> = ({ onSuccess }) => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
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
      const result = await signIn?.create({
        identifier: formData.email,
        password: formData.password,
      })

      if (result?.status === 'complete') {
        if (setActive) {
          await setActive({ session: result.createdSessionId })
        }
        
        // Redirect to profile page
        router.push('/profile')
        
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error('Sign in failed:', result)
        setErrors({ general: 'Sign in failed. Please try again.' })
      }
    } catch (error: unknown) {
      console.error('Sign in error:', error)
      
      const errorObj = error as { errors?: Array<{ code: string }>; message?: string }
      if (errorObj.errors?.[0]?.code === 'form_identifier_not_found') {
        setErrors({ email: 'No account found with this email' })
      } else if (errorObj.errors?.[0]?.code === 'form_password_incorrect') {
        setErrors({ password: 'Incorrect password' })
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
            placeholder="Enter your password"
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </>
        )}
      </Button>

      {/* Forgot Password Link */}
      <div className="text-center">
        <a 
          href="/forgot-password" 
          className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline"
        >
          Forgot your password?
        </a>
      </div>
    </form>
  )
} 