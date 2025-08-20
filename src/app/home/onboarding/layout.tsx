import React from 'react'


const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
   


  return (
    <div className="flex justify-center items-center h-screen bg-gray-50" >
      {children}
    </div>
  )
}

export default OnboardingLayout;