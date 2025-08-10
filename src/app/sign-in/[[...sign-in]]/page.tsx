import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../core/ui/elements/Card'
import { Shield, Users, Heart, Zap } from 'lucide-react'
import MainNav from '@/app/core/ui/components/MainNav'
import { CustomSignIn } from '@/modules/user/components/CustomSignIn'

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">
     <MainNav/>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Socially
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome back! 👋
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Connect with friends, share your moments, and stay in control of your data.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Your Data, Your Control</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Full ownership of your content</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Authentic Connections</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Real relationships, real moments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Lightning Fast</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Instant sharing & connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Privacy First</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No data mining, no tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Why choose Socially?</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Zero data selling to third parties
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Complete control over your content
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                End-to-end encryption for messages
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Transparent privacy policies
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Sign In Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Welcome back to your social space
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomSignIn />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignInPage