import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../core/ui/elements/Card'
import { Heart, Star, Lock, Globe, Sparkles } from 'lucide-react'
import MainNav from '@/app/core/ui/components/MainNav'
// import { CustomSignUp } from '@/modules/user/components/CustomSignUp'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center p-4">

      <MainNav/>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Socially
              </h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Join the revolution! 🚀
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Be part of a social network where you own your data and control your digital life.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Sold</div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Privacy by Design</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Built with your privacy first</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Global Community</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Connect with people worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Premium Features</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Advanced tools included</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">Authentic Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No algorithms, real connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What You Get */}
          <div className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">What you get with Socially:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Complete data ownership
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                End-to-end encryption
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                No targeted advertising
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Content monetization
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Custom privacy settings
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Data export anytime
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-6 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join 10,000+ users who trust us</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              &quot;Finally, a social network that respects my privacy and gives me control over my data!&quot; - Sarah M.
            </p>
          </div>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Start your journey to digital freedom
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <CustomSignUp /> */}
              <SignUp />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage