'use client'

import { useEffect, useState } from 'react'

interface FaceIOScriptLoaderProps {
  appId: string
  onLoad?: () => void
  onError?: (error: Error) => void
}

export const FaceIOScriptLoader: React.FC<FaceIOScriptLoaderProps> = ({
  appId,
  onLoad,
  onError
}) => {
  const [, setIsLoaded] = useState(false)
  const [, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadFaceIOScript = async () => {
      try {
        // Check if already loaded
        if (typeof (window as unknown as { faceIO?: unknown }).faceIO !== 'undefined') {
          setIsLoaded(true)
          onLoad?.()
          return
        }

        // Check if script tag already exists
        const existingScript = document.querySelector('script[src="https://cdn.faceio.net/fio.js"]')
        if (existingScript) {
          // Wait for existing script to load
          let attempts = 0
          while (attempts < 20) {
            if (typeof (window as unknown as { faceIO?: unknown }).faceIO !== 'undefined') {
              setIsLoaded(true)
              onLoad?.()
              return
            }
            await new Promise(resolve => setTimeout(resolve, 100))
            attempts++
          }
        }

        // Load script manually
        const script = document.createElement('script')
        script.src = 'https://cdn.faceio.net/fio.js'
        script.async = true
        
        script.onload = () => {
          console.log('FaceIO script loaded successfully')
          setIsLoaded(true)
          onLoad?.()
        }
        
        script.onerror = () => {
          const error = new Error('Failed to load FaceIO script')
          console.error('FaceIO script failed to load:', error)
          setError(error)
          onError?.(error)
        }
        
        document.head.appendChild(script)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error loading FaceIO script')
        console.error('Error loading FaceIO script:', error)
        setError(error)
        onError?.(error)
      }
    }

    loadFaceIOScript()
  }, [appId, onLoad, onError])

  // This component doesn't render anything visible
  return null
} 