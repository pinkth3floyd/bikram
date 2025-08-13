// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Card } from '../../../app/core/ui/elements/Card'
// import { Button } from '../../../app/core/ui/elements/Button'

// interface FaceVerificationDebugProps {
//   className?: string
// }

// export const FaceVerificationDebug: React.FC<FaceVerificationDebugProps> = ({
//   className = ''
// }) => {
//   const [debugInfo, setDebugInfo] = useState<{
//     environment: {
//       faceIOAppId: string
//     }
//     browser: {
//       userAgent: string
//       hasCamera: boolean
//       hasWebRTC: boolean
//       isHTTPS: boolean
//     }
//     api: {
//       testEndpoint: {
//         status: string | number
//         ok: boolean
//         error: string | null
//       } | null
//       faceVerificationEndpoint: {
//         status: string | number
//         ok: boolean
//         error: string | null
//       } | null
//     }
//   } | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     checkDebugInfo()
//   }, [])

//   const checkDebugInfo = async () => {
//     try {
//       // Check environment variables
//       const environment = {
//         faceIOAppId: process.env.NEXT_PUBLIC_FACE_IO_APP_ID || 'NOT_SET'
//       }

//       // Check browser capabilities
//       const browser = {
//         userAgent: navigator.userAgent,
//         hasCamera: !!navigator.mediaDevices?.getUserMedia,
//         hasWebRTC: !!window.RTCPeerConnection,
//         isHTTPS: window.location.protocol === 'https:'
//       }

//       // Test API endpoints
//       const api: {
//         testEndpoint: {
//           status: string | number
//           ok: boolean
//           error: string | null
//         } | null
//         faceVerificationEndpoint: {
//           status: string | number
//           ok: boolean
//           error: string | null
//         } | null
//       } = {
//         testEndpoint: null,
//         faceVerificationEndpoint: null
//       }

//       try {
//         const testResponse = await fetch('/api/test')
//         api.testEndpoint = {
//           status: testResponse.status,
//           ok: testResponse.ok,
//           error: testResponse.ok ? null : 'API test failed'
//         }
//       } catch (error) {
//         api.testEndpoint = {
//           status: 'ERROR',
//           ok: false,
//           error: error instanceof Error ? error.message : 'Unknown error'
//         }
//       }

//       try {
//         const faceResponse = await fetch('/api/face-verification')
//         api.faceVerificationEndpoint = {
//           status: faceResponse.status,
//           ok: faceResponse.ok,
//           error: faceResponse.ok ? null : 'Face verification API failed'
//         }
//       } catch (error) {
//         api.faceVerificationEndpoint = {
//           status: 'ERROR',
//           ok: false,
//           error: error instanceof Error ? error.message : 'Unknown error'
//         }
//       }

//       setDebugInfo({ environment, browser, api })
//     } catch (error) {
//       console.error('Debug info error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <Card className={`p-4 ${className}`}>
//         <p className="text-sm text-gray-600">Loading debug information...</p>
//       </Card>
//     )
//   }

//   if (!debugInfo) {
//     return (
//       <Card className={`p-4 ${className}`}>
//         <p className="text-sm text-red-600">Failed to load debug information</p>
//       </Card>
//     )
//   }

//   return (
//     <Card className={`p-4 ${className}`}>
//       <h3 className="text-sm font-semibold mb-3">Face Verification Debug Info</h3>
      
//       <div className="space-y-3 text-xs">
//         <div>
//           <h4 className="font-medium text-gray-700">Environment Variables:</h4>
//           <div className="ml-2">
//             <p>FaceIO App ID: <span className={debugInfo.environment.faceIOAppId === 'NOT_SET' ? 'text-red-600' : 'text-green-600'}>{debugInfo.environment.faceIOAppId}</span></p>
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium text-gray-700">Browser Capabilities:</h4>
//           <div className="ml-2">
//             <p>Camera Support: <span className={debugInfo.browser.hasCamera ? 'text-green-600' : 'text-red-600'}>{debugInfo.browser.hasCamera ? 'Yes' : 'No'}</span></p>
//             <p>WebRTC Support: <span className={debugInfo.browser.hasWebRTC ? 'text-green-600' : 'text-red-600'}>{debugInfo.browser.hasWebRTC ? 'Yes' : 'No'}</span></p>
//             <p>HTTPS: <span className={debugInfo.browser.isHTTPS ? 'text-green-600' : 'text-red-600'}>{debugInfo.browser.isHTTPS ? 'Yes' : 'No'}</span></p>
//           </div>
//         </div>

//         <div>
//           <h4 className="font-medium text-gray-700">API Endpoints:</h4>
//           <div className="ml-2">
//             <p>Test API: <span className={debugInfo.api.testEndpoint.ok ? 'text-green-600' : 'text-red-600'}>{debugInfo.api.testEndpoint.status}</span></p>
//             <p>Face Verification API: <span className={debugInfo.api.faceVerificationEndpoint.ok ? 'text-green-600' : 'text-red-600'}>{debugInfo.api.faceVerificationEndpoint.status}</span></p>
//           </div>
//         </div>

//         {debugInfo.api.testEndpoint.error && (
//           <div className="text-red-600">
//             <p>Test API Error: {debugInfo.api.testEndpoint.error}</p>
//           </div>
//         )}

//         {debugInfo.api.faceVerificationEndpoint.error && (
//           <div className="text-red-600">
//             <p>Face Verification API Error: {debugInfo.api.faceVerificationEndpoint.error}</p>
//           </div>
//         )}
//       </div>

//       <Button
//         onClick={checkDebugInfo}
//         size="sm"
//         variant="outline"
//         className="mt-3 w-full"
//       >
//         Refresh Debug Info
//       </Button>
//     </Card>
//   )
// } 