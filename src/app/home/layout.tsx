import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import React from 'react'

const HomeLayout = async({ children }: { children: React.ReactNode }) => {
  const user = (await auth());

  if (!user) {
    return redirect('/sign-in');
  }

  // Only check metadata and redirect if not already on onboarding page
  // if (!pathname.includes('/onboarding')) {
  //   //check face auth state
  //   const metadata = (await (await clerkClient()).users.getUser(user.userId!)).privateMetadata;

  //   // Check if metadata is empty or doesn't exist
  //   if (!metadata || Object.keys(metadata).length === 0) {
  //     console.log('no metadata or empty metadata object');
  //     redirect('/home/onboarding');
  //   }
  // }







  return (
    <div>

      <p>User ID: {user.userId}</p>
     {/* <p>User Metadata: {JSON.stringify(await user?.privateMetadata)}</p> */}

        {children}
    </div>
  )
}

export default HomeLayout;