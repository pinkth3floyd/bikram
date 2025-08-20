'use client'

// import { useUser } from '@clerk/nextjs'
import React from 'react'
import { SignoutButton } from '../../modules/user/components/SignoutButton'

const HomePage = () => {

  // const user = useUser()

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-row gap-4">
          <SignoutButton />

          {/* <UserProfile userId={user.user?.id!} requestingUserId={user.user?.id}  /> */}
        
        </div>



      </div>










     
    </div>
  )
}

export default HomePage