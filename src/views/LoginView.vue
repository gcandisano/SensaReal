<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      error.value = 'Por favor complete todos los campos'
      return
    }

    isLoading.value = true
    const response = await authService.login({
      email: email.value,
      password: password.value
    })

    // Guardar el token y la información del usuario en el store
    authStore.setAuth(response)
    
    // Redirigir al dashboard después del login exitoso
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Iniciar Sesión</h1>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Tu contraseña"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="auth-button" :disabled="isLoading">
          {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>

        <div class="auth-link">
          ¿No tienes una cuenta? <RouterLink to="/register">Regístrate aquí</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
