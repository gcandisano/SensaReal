export interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string
  name: string
}

export interface AuthResponse {
  token?: string
  user: User
  needsVerification?: boolean
}

export interface VerifyEmailResponse {
  message: string
}

export interface SendEmailVerificationResponse {
  message: string
}
