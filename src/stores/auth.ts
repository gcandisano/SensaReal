import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, AuthResponse } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)

  const setAuth = ({ token: authToken, user: userData }: AuthResponse) => {
    token.value = authToken
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('token', authToken)
  }

  const clearAuth = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    clearAuth,
  }
})
