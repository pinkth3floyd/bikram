'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../core/ui/elements/Card'
import { Button } from '../core/ui/elements/Button'
import { Input } from '../core/ui/elements/Input'
import { TextArea } from '../core/ui/elements/TextArea'
import { Label } from '../core/ui/elements/Label'
import MainNav from '@/app/core/ui/components/MainNav'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  Users, 
  Shield, 
  Heart,
  ArrowRight,
  FileText,
  Zap
} from 'lucide-react'
import Footer from '../core/ui/components/Footer'

const ContactPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get in touch via email',
      value: 'hello@socially.com',
      color: 'from-purple-500 to-pink-500',
      action: 'mailto:hello@socially.com'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      value: 'Available 24/7',
      color: 'from-blue-500 to-cyan-500',
      action: '#chat'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team',
      value: '+1 (555) 123-4567',
      color: 'from-green-500 to-emerald-500',
      action: 'tel:+15551234567'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our office location',
      value: 'San Francisco, CA',
      color: 'from-red-500 to-pink-500',
      action: '#location'
    }
  ]

  const supportTopics = [
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Questions about data protection and privacy features',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Account & Billing',
      description: 'Help with your account, payments, and subscriptions',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Community & Features',
      description: 'Learn about features and community guidelines',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Technical Support',
      description: 'Technical issues and platform troubleshooting',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const faqs = [
    {
      question: 'How do you protect my data?',
      answer: 'We use end-to-end encryption and never sell your data to third parties. You have complete control over your information.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes! You can export all your data anytime through your account settings. We believe in complete data portability.'
    },
    {
      question: 'Is Socially free to use?',
      answer: 'Our core features are completely free. We offer premium features for power users who want advanced tools.'
    },
    {
      question: 'How do you make money?',
      answer: 'We generate revenue through premium subscriptions and optional features, never through selling user data.'
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
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              We&apos;d love to hear from you. Reach out to us for support, feedback, or just to say hello!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card 
                key={method.title}
                className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl cursor-pointer`}
                onClick={() => window.open(method.action, '_blank')}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <method.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {method.description}
                  </p>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">
                    {method.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm">
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-8 py-3 rounded-lg transition-all ${
                  activeTab === 'contact'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Contact Form
              </button>
              <button
                onClick={() => setActiveTab('support')}
                className={`px-8 py-3 rounded-lg transition-all ${
                  activeTab === 'support'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Support Topics
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-8 py-3 rounded-lg transition-all ${
                  activeTab === 'faq'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                FAQ
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-500">
            {activeTab === 'contact' && (
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-3xl">Send us a Message</CardTitle>
                    <CardDescription>
                      We&apos;ll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What&apos;s this about?"
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <TextArea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more..."
                          rows={6}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Send Message
                        <Send className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                      Let&apos;s Connect
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                      Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Response Time</h4>
                        <p className="text-gray-600 dark:text-gray-400">Within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Support Team</h4>
                        <p className="text-gray-600 dark:text-gray-400">Expert team ready to help</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Privacy First</h4>
                        <p className="text-gray-600 dark:text-gray-400">Your data stays private</p>
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <Card className="border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Office Hours</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex justify-between">
                          <span>Monday - Friday</span>
                          <span>9:00 AM - 6:00 PM PST</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday</span>
                          <span>10:00 AM - 4:00 PM PST</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sunday</span>
                          <span>Closed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'support' && (
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    How can we help you?
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Choose a topic below to get the help you need
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {supportTopics.map((topic, index) => (
                    <Card 
                      key={topic.title}
                      className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:scale-105 hover:shadow-xl cursor-pointer`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${topic.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <topic.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              {topic.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {topic.description}
                            </p>
                            <Button variant="outline" size="sm">
                              Get Help
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Find answers to common questions about Socially
                  </p>
                </div>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <Card 
                      key={index}
                      className={`border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-500 delay-${index * 100} hover:shadow-lg`}
                    >
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          {faq.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
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
            Still have questions?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              Start Live Chat
              <MessageCircle className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              View Documentation
              <FileText className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default ContactPage
