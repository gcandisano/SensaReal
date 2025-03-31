<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')
const error = ref('')
const isLoading = ref(false)

const handleRegister = async () => {
  try {
    if (!email.value || !password.value || !confirmPassword.value || !name.value) {
      error.value = 'Por favor complete todos los campos'
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden'
      return
    }

    isLoading.value = true
    const response = await authService.register({
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
      name: name.value,
    })

    authStore.setAuth(response)
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Error al registrar usuario'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Registro</h1>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input type="text" id="name" v-model="name" required placeholder="Tu nombre" />
        </div>

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

        <div class="form-group">
          <label for="confirm-password">Confirmar Contraseña</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            required
            placeholder="Confirma tu contraseña"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="auth-button" :disabled="isLoading">
          {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <div class="auth-link">
          ¿Ya tienes una cuenta? <RouterLink to="/login">Inicia sesión aquí</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
