interface FaceIOInstance {
  enroll: (options: FaceIOEnrollOptions) => Promise<FaceIOEnrollResult>
  authenticate: (options: FaceIOAuthenticateOptions) => Promise<FaceIOAuthenticateResult>
  delete: (faceId: string) => Promise<void>
}

interface FaceIOEnrollOptions {
  locale?: string
  payload?: Record<string, unknown>
  [key: string]: unknown
}

interface FaceIOAuthenticateOptions {
  locale?: string
  [key: string]: unknown
}

interface FaceIOEnrollResult {
  facialId: string
  [key: string]: unknown
}

interface FaceIOAuthenticateResult {
  payload: Record<string, unknown>
  confidence: number
  [key: string]: unknown
}

interface WindowWithFaceIO extends Window {
  faceIO?: new (appId: string) => FaceIOInstance
}

export interface FaceEnrollmentResult {
  success: boolean
  faceId?: string
  error?: string
}

export interface FaceVerificationResult {
  success: boolean
  verified: boolean
  confidence?: number
  error?: string
}

export class FaceIOService {
  private faceio: FaceIOInstance | null = null
  private appId: string

  constructor(appId?: string) {
    this.appId = appId || process.env.NEXT_PUBLIC_FACE_IO_APP_ID || 'fioae5c6'
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      // Initialize asynchronously
      this.initializeFaceIO().catch(error => {
        console.error('FaceIO initialization failed:', error)
      })
    }
  }

  private async initializeFaceIO() {
    try {
      // Check if script is already loaded
      if (typeof (window as WindowWithFaceIO).faceIO !== 'undefined') {
        this.faceio = new ((window as WindowWithFaceIO).faceIO!)(this.appId)
        console.log('FaceIO initialized successfully')
        return
      }

      // Wait for FaceIO script to be loaded
      let attempts = 0
      const maxAttempts = 30 // Increased attempts
      
      while (attempts < maxAttempts) {
        if (typeof (window as WindowWithFaceIO).faceIO !== 'undefined') {
          // FaceIO script is loaded, initialize
          this.faceio = new ((window as WindowWithFaceIO).faceIO!)(this.appId)
          console.log('FaceIO initialized successfully')
          return
        }
        
        // Wait 300ms before next attempt
        await new Promise(resolve => setTimeout(resolve, 300))
        attempts++
      }
      
      console.error('FaceIO script not loaded after maximum attempts')
      
      // Try to load the script manually as fallback
      if (typeof (window as WindowWithFaceIO).faceIO === 'undefined') {
        console.log('Attempting to load FaceIO script manually...')
        await this.loadFaceIOScriptManually()
      }
    } catch (error) {
      console.error('Failed to initialize FaceIO:', error)
    }
  }

  private async loadFaceIOScriptManually(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.faceio.net/fio.js'
      script.async = true
      
      script.onload = () => {
        console.log('FaceIO script loaded manually')
        try {
          this.faceio = new ((window as WindowWithFaceIO).faceIO!)(this.appId)
          resolve()
        } catch (error) {
          console.error('Failed to initialize FaceIO after manual script load:', error)
          reject(error)
        }
      }
      
      script.onerror = () => {
        console.error('Failed to load FaceIO script manually')
        reject(new Error('Failed to load FaceIO script'))
      }
      
      document.head.appendChild(script)
    })
  }

  async enrollUser(userId: string, userEmail: string): Promise<FaceEnrollmentResult> {
    if (!this.faceio) {
      // Try to initialize if not already done
      await this.initializeFaceIO()
      
      if (!this.faceio) {
        return {
          success: false,
          error: 'FaceIO not initialized'
        }
      }
    }

    try {
      const result = await this.faceio.enroll({
        locale: 'en',
        payload: {
          userId: userId,
          email: userEmail
        },
        userConsent: true
      })

      return {
        success: true,
        faceId: result.facialId
      }
    } catch (error: unknown) {
      console.error('Face enrollment failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Face enrollment failed'
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async verifyUser(userId: string, userEmail: string): Promise<FaceVerificationResult> {
    if (!this.faceio) {
      // Try to initialize if not already done
      await this.initializeFaceIO()
      
      if (!this.faceio) {
        return {
          success: false,
          verified: false,
          error: 'FaceIO not initialized'
        }
      }
    }

    try {
      const result = await this.faceio.authenticate({
        locale: 'en',
        payload: {
          userId: userId,
          email: userEmail
        }
      })

      return {
        success: true,
        verified: true,
        confidence: result.confidence
      }
    } catch (error: unknown) {
      console.error('Face verification failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Face verification failed'
      return {
        success: false,
        verified: false,
        error: errorMessage
      }
    }
  }

  async deleteUser(faceId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.faceio) {
      // Try to initialize if not already done
      await this.initializeFaceIO()
      
      if (!this.faceio) {
        return {
          success: false,
          error: 'FaceIO not initialized'
        }
      }
    }

    try {
      await this.faceio.delete(faceId)
      return { success: true }
    } catch (error: unknown) {
      console.error('Face deletion failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Face deletion failed'
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  isInitialized(): boolean {
    return this.faceio !== null
  }

  getFaceIO(): FaceIOInstance | null {
    return this.faceio
  }
} 