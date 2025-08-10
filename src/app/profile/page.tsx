'use client'

import React from 'react'
import Link from 'next/link'
import { useCurrentUser } from '@/modules/user/hooks/useUser'
import { UserProfile } from '@/modules/user/components/UserProfile'
import { Card, CardContent, CardHeader, CardTitle } from '../core/ui/elements/Card'
import { Button } from '../core/ui/elements/Button'
import { Skeleton } from '../core/ui/elements/Skeleton'
import { User, Settings, Edit, Plus } from 'lucide-react'
import MainNav from '../core/ui/components/MainNav'

const ProfilePage = () => {
  const { user, isLoading, isSignedIn } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <MainNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please sign in to view your profile
            </p>
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    Welcome to Socially! 🎉
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your profile is ready. Start connecting with others and sharing your moments!
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <div className="lg:col-span-2">
              <UserProfile userId={user.getId()} requestingUserId={user.getId()} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card className="border-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      1
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Complete Profile</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Add your bio and photo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      2
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Find Friends</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Connect with people you know</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      3
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">Share Content</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Start posting and engaging</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Tips */}
              <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Privacy Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Review your privacy settings regularly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                         <span>Only share what you&apos;re comfortable with</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Use two-factor authentication</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 