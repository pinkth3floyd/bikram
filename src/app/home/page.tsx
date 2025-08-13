'use client'

import React, { useState } from 'react'
import { FaceVerificationRedirect } from '../../modules/user/components/FaceVerificationRedirect'
import { ClientOnly } from '../../modules/user/components/ClientOnly'

const HomePage = () => {
  const [showMainContent, setShowMainContent] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Face Verification Check */}
        <ClientOnly>
          <FaceVerificationRedirect 
            onComplete={() => setShowMainContent(true)}
          />
        </ClientOnly>

        {/* Main Content - only show after face verification check */}
        {showMainContent && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Socially
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Your account is now fully set up and ready to use. You can start exploring all the features available to you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Connect</h3>
                <p className="text-blue-700">Find and connect with friends and family</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Share</h3>
                <p className="text-green-700">Share your moments and experiences</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Discover</h3>
                <p className="text-purple-700">Discover new content and communities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage