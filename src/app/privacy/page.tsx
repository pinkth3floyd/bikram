'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../core/ui/elements/Card'
import { Button } from '../core/ui/elements/Button'
import MainNav from '@/app/core/ui/components/MainNav'
import { 
  Shield, 
  Lock, 
  Eye, 
  Key, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Download,
  MessageCircle
} from 'lucide-react'
import Footer from '../core/ui/components/Footer'

const PrivacyPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const privacyPrinciples = [
    {
      icon: Shield,
      title: 'Data Ownership',
      description: 'You own your data completely. We never claim ownership of your content.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your messages and sensitive data are encrypted by default.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We&apos;re completely transparent about how we handle your data.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Key,
      title: 'User Control',
      description: 'You have complete control over your privacy settings and data.',
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
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Your privacy is our priority. Learn how we protect your data and give you control.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                Download PDF
                <Download className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Last Updated: Dec 2024
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Our Privacy Principles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              These principles guide everything we do with your data
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {privacyPrinciples.map((principle, index) => (
              <Card 
                key={principle.title}
                className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${principle.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <principle.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {principle.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-8 py-3 rounded-lg transition-all ${
                  activeTab === 'overview'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('rights')}
                className={`px-8 py-3 rounded-lg transition-all ${
                  activeTab === 'rights'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Your Rights
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                    Your Privacy Matters
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    At Socially, we believe privacy is a fundamental human right. We&apos;ve built our platform 
                    from the ground up with privacy-first principles, ensuring you have complete control 
                    over your data and digital identity.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">We never sell your data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">End-to-end encryption by default</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Complete data portability</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Transparent data practices</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 backdrop-blur-sm">
                    <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Key Highlights</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">GDPR Compliant</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">CCPA Compliant</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">SOC 2 Type II Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'rights' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Your Privacy Rights
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    You have complete control over your data
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Data Export
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Download all your data in a portable format anytime
                          </p>
                          <Button variant="outline" size="sm">
                            Export Data
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Data Deletion
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Permanently delete your account and all associated data
                          </p>
                          <Button variant="outline" size="sm">
                            Delete Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Our privacy team is here to help you understand your rights and our practices.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Contact Privacy Team
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Download Full Policy
              <Download className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
            <Footer/>
    </div>
  )
}

export default PrivacyPage
