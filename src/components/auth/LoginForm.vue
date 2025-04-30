<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      error.value = 'Por favor complete todos los campos'
      return
    }

    isLoading.value = true
    const response = await authService.login({
      email: email.value,
      password: password.value,
    })

    authStore.setAuth(response)
    router.push('/')
  } catch (e: any) {
    console.log(e)
    const status = e.response?.status
    if (status >= 400 && status < 500) {
      error.value = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.'
    } else {
      error.value = 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
    }
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div
    class="w-full min-w-[400px] min-h-[400px] max-w-[400px] bg-[#1E1E1E] p-8 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4"
  >
    <h1 class="text-3xl font-normal text-center text-white">Iniciar Sesión</h1>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-8 w-full">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label for="email" class="text-lg font-normal text-gray-400">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            class="w-full px-4 py-3 bg-[#2C2C2C] border-none rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="text-lg font-normal text-gray-400">Contraseña</label>
          <div class="relative">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              required
              class="w-full px-4 py-3 bg-[#2C2C2C] border-none rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
            >
              <FontAwesomeIcon :icon="showPassword ? faEyeSlash : faEye" class="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="text-red-400 text-sm text-center animate-fade-in">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full py-3 px-4 bg-[#4C8FE9] text-white text-lg rounded-lg hover:bg-[#4080D5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1E1E1E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isLoading" class="animate-spin mr-2">⟳</span>
        {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>

      <div class="flex items-center justify-center gap-1 text-base">
        <span class="text-gray-400">¿No tienes una cuenta?</span>
        <RouterLink to="/register" class="text-[#4C8FE9] hover:text-[#4080D5] transition-colors">
          Regístrate aquí
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
</style>
