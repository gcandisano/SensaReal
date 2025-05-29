import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  SendEmailVerificationResponse,
  VerifyEmailResponse,
} from '@/types/auth'
import api from './index'
import { API_ROUTES } from './endpoints'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials)
    return data
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, credentials)
    return data
  },

  async logout(): Promise<void> {
    await api.post(API_ROUTES.AUTH.LOGOUT)
  },

  async sendEmailVerification(email: string): Promise<SendEmailVerificationResponse> {
    const { data } = await api.post<SendEmailVerificationResponse>(
      API_ROUTES.AUTH.RESEND_VERIFICATION,
      { email },
    )
    return data
  },

  async verifyEmail(token: string): Promise<VerifyEmailResponse> {
    const { data } = await api.post<VerifyEmailResponse>(API_ROUTES.AUTH.VERIFY_EMAIL, { token })
    return data
  },
}
