'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../core/ui/elements/Card'
import { Button } from '../core/ui/elements/Button'
import MainNav from '@/app/core/ui/components/MainNav'
import { 
  Shield, 
  Users, 
  Heart, 
  Star, 
  Lock, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Eye,
  Key,
  Database,
  MessageCircle,
  Camera,
  Video,
  Music,
  FileText,
  Globe2
} from 'lucide-react'
import Footer from '../core/ui/components/Footer'

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('mission')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users', color: 'from-purple-500 to-pink-500' },
    { icon: Globe, value: '50+', label: 'Countries', color: 'from-blue-500 to-cyan-500' },
    { icon: Shield, value: '100%', label: 'Data Secure', color: 'from-green-500 to-emerald-500' },
    { icon: Star, value: '4.9', label: 'User Rating', color: 'from-yellow-500 to-orange-500' }
  ]

  const values = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data belongs to you. We never sell, share, or exploit your personal information.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by users, for users. Your feedback shapes our platform.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Open source principles with clear, honest communication about our practices.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Authentic Connections',
      description: 'Foster real relationships without algorithmic manipulation.',
      color: 'from-red-500 to-pink-500'
    }
  ]

  const features = [
    { icon: Camera, name: 'Photo Sharing', description: 'Share moments with full control' },
    { icon: Video, name: 'Video Stories', description: 'Create engaging video content' },
    { icon: MessageCircle, name: 'Secure Messaging', description: 'End-to-end encrypted chats' },
    { icon: Music, name: 'Audio Posts', description: 'Share voice messages and podcasts' },
    { icon: FileText, name: 'Blog Posts', description: 'Long-form content creation' },
    { icon: Globe2, name: 'Global Reach', description: 'Connect with people worldwide' }
  ]

  const team = [
    {
      name: 'Alex Chen',
      role: 'CEO & Founder',
      bio: 'Privacy advocate with 10+ years in social media technology',
      avatar: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Security expert passionate about user data protection',
      avatar: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Design',
      bio: 'Creating beautiful, accessible user experiences',
      avatar: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      name: 'Emma Thompson',
      role: 'Community Manager',
      bio: 'Building meaningful connections between users',
      avatar: 'bg-gradient-to-r from-red-500 to-pink-500'
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              About Socially
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              We&apos;re revolutionizing social media by putting users first. 
              Your data, your control, your digital freedom.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Join Our Mission
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Read Our Manifesto
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We believe social media should empower users, not exploit them.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('mission')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'mission'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Our Mission
              </button>
              <button
                onClick={() => setActiveTab('values')}
                className={`px-6 py-3 rounded-lg transition-all ${
                  activeTab === 'values'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Our Values
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === 'mission' && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                    Democratizing Social Media
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    We&apos;re building a social platform where users have complete control over their data, 
                    content, and digital identity. No more algorithmic manipulation, no more data mining, 
                    no more privacy violations.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">User-owned data architecture</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Transparent algorithms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Open source development</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Transparency</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">See exactly how your data is used</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Key className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Control</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Full ownership of your content</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Database className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">Freedom</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Export your data anytime</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card 
                    key={value.title}
                    className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <value.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {value.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/30 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to connect, share, and grow
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.name}
                className={`text-center transition-all duration-500 delay-${index * 100} hover:scale-110`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {feature.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              The passionate people behind Socially
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={member.name}
                className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-center transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl`}
              >
                <CardContent className="p-6">
                  <div className={`w-20 h-20 ${member.avatar} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
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
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default AboutPage
