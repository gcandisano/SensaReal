import type { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/auth'
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
}
