

declare namespace NodeJS {
    interface ProcessEnv {
    
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:string;
      CLERK_SECRET_KEY:string;
      NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL:string;
      NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL:string;
      NEXT_PUBLIC_CLERK_SIGN_UP_URL:string;
      NEXT_PUBLIC_CLERK_SIGN_IN_URL:string;
      NEXT_PUBLIC_FACE_IO_APP_ID:string;
      
      // Turso Database Configuration
      TURSO_URL:string;
      TURSO_AUTH_TOKEN:string;
      TURSO_URL_READONLY?:string;
      TURSO_AUTH_TOKEN_READONLY?:string;
      BLOB_READ_WRITE_TOKEN:string;
    }
  }
  