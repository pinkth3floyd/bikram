'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './core/ui/elements/Card'
import { Button } from './core/ui/elements/Button'
import MainNav from "./core/ui/components/MainNav"
import { 
  Shield, 
  Users, 
  Star, 
  Lock, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Eye,
  Key,
  MessageCircle,
  Camera,
  Video,
  Music,
  FileText,
  Globe2,
  Play
} from 'lucide-react'

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users', color: 'from-purple-500 to-pink-500', growth: '+15%' },
    { icon: Globe, value: '50+', label: 'Countries', color: 'from-blue-500 to-cyan-500', growth: '+8%' },
    { icon: Shield, value: '100%', label: 'Data Secure', color: 'from-green-500 to-emerald-500', growth: '✓' },
    { icon: Star, value: '4.9', label: 'User Rating', color: 'from-yellow-500 to-orange-500', growth: '+0.2' }
  ]

  const features = [
    {
      icon: Camera,
      title: 'Photo Sharing',
      description: 'Share moments with full control',
      color: 'from-purple-500 to-pink-500',
      stats: '2.5M+ photos shared'
    },
    {
      icon: Video,
      title: 'Video Stories',
      description: 'Create engaging video content',
      color: 'from-blue-500 to-cyan-500',
      stats: '1.2M+ videos created'
    },
    {
      icon: MessageCircle,
      title: 'Secure Messaging',
      description: 'End-to-end encrypted chats',
      color: 'from-green-500 to-emerald-500',
      stats: '5M+ messages sent'
    },
    {
      icon: Music,
      title: 'Audio Posts',
      description: 'Share voice messages and podcasts',
      color: 'from-red-500 to-pink-500',
      stats: '800K+ audio posts'
    },
    {
      icon: FileText,
      title: 'Blog Posts',
      description: 'Long-form content creation',
      color: 'from-yellow-500 to-orange-500',
      stats: '150K+ articles written'
    },
    {
      icon: Globe2,
      title: 'Global Reach',
      description: 'Connect with people worldwide',
      color: 'from-indigo-500 to-purple-500',
      stats: '50+ countries active'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Digital Creator',
      content: 'Finally, a platform that respects my privacy while helping me grow my audience!',
      avatar: 'bg-gradient-to-r from-purple-500 to-pink-500',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Privacy Advocate',
      content: 'I love having complete control over my data. This is how social media should be.',
      avatar: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Community Manager',
      content: 'The authentic connections I\'ve made here are incredible. No algorithms, just real people.',
      avatar: 'bg-gradient-to-r from-green-500 to-emerald-500',
      rating: 5
    }
  ]

  const chartData = [
    { month: 'Jan', users: 1200, posts: 8500, engagement: 78 },
    { month: 'Feb', users: 1800, posts: 12000, engagement: 82 },
    { month: 'Mar', users: 2400, posts: 16000, engagement: 85 },
    { month: 'Apr', users: 3200, posts: 21000, engagement: 88 },
    { month: 'May', users: 4100, posts: 27000, engagement: 91 },
    { month: 'Jun', users: 5200, posts: 34000, engagement: 94 }
  ]

  const privacyFeatures = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your messages and data are encrypted by default',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      title: 'Transparent Algorithms',
      description: 'See exactly how content is ranked and recommended',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Key,
      title: 'Data Ownership',
      description: 'You own your data completely - export anytime',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'No Data Selling',
      description: 'We never sell your data to third parties',
      color: 'from-red-500 to-pink-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Welcome to Socially
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              The social network where you own your data, control your experience, and build authentic connections.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Watch Demo
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>
            
            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {stat.growth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to connect, share, and grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {feature.description}
                    </p>
                    <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                      {feature.stats}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-16 bg-white/30 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                Privacy by Design
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                We&apos;ve built privacy into every aspect of our platform. Your data belongs to you, and you have complete control over how it&apos;s used.
              </p>
              <div className="space-y-4">
                                 {privacyFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Animated Chart */}
            <div className="relative">
              <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Platform Growth</CardTitle>
                  <CardDescription>Monthly active users and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* User Growth Chart */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</span>
                        <span className="text-sm text-green-600 dark:text-green-400">+15% this month</span>
                      </div>
                      <div className="flex items-end space-x-2 h-32">
                        {chartData.map((data, index) => (
                          <div key={data.month} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-1000"
                              style={{ 
                                height: `${(data.users / 6000) * 100}%`,
                                animationDelay: `${index * 100}ms`
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Engagement Chart */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</span>
                        <span className="text-sm text-blue-600 dark:text-blue-400">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-2000"
                          style={{ width: '94%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Join thousands of satisfied users who trust Socially
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl`}
              >
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`w-16 h-16 ${testimonial.avatar} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl font-bold`}>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Be part of the future of social media where users come first.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
