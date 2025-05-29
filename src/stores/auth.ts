import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const setAuth = ({ token: authToken, user: userData }: AuthResponse) => {
    token.value = authToken ?? null
    user.value = userData
    isAuthenticated.value = !!authToken
    localStorage.setItem('token', authToken ?? '')
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const setUser = (userData: User) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    clearAuth,
    setUser,
    clearUser,
  }
})
