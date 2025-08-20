'use client'

import { SignOutButton } from '@clerk/nextjs'
import React from 'react'

const HomePage = () => {

  return (
    <div className="min-h-screen bg-gray-50">



      <button onClick={() => {
        window.location.href = '/home/onboarding'
      }}>
        Onboarding
      </button>

<SignOutButton>
  <button>
    Logout
  </button>
</SignOutButton>
     



     
    </div>
  )
}

export default HomePage