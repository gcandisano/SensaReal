<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheckCircle, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { authService } from '@/services/api/auth'
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const success = ref(false)

const verifyEmail = async () => {
  const token = route.query.token as string

  if (!token) {
    error.value = 'Token de verificación no encontrado'
    loading.value = false
    return
  }

  try {
    const response = await authService.verifyEmail(token)

    if (response.message === 'Email verified successfully') {
      success.value = true
    } else {
      error.value = 'Error al verificar el email'
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al verificar el email'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  verifyEmail()
})
</script>

<template>
  <div class="min-h-screen flex justify-center items-center py-8 px-4">
    <div
      class="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center gap-6"
    >
      <div class="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
        <font-awesome-icon
          :icon="loading ? faSpinner : success ? faCheckCircle : faTimesCircle"
          class="text-3xl"
          :class="{
            'text-blue-500 animate-spin': loading,
            'text-green-500': success,
            'text-red-500': error,
          }"
        />
      </div>

      <div class="text-center">
        <h1 class="text-2xl font-bold text-white mb-2">
          {{
            loading
              ? 'Verificando email...'
              : success
                ? 'Email verificado'
                : 'Error de verificación'
          }}
        </h1>
        <p class="text-gray-300">
          {{
            loading
              ? 'Por favor espere mientras verificamos su email'
              : success
                ? 'Su email ha sido verificado exitosamente'
                : error
          }}
        </p>
      </div>

      <div v-if="!loading" class="flex gap-4">
        <button
          v-if="error"
          @click="verifyEmail"
          class="px-6 py-2 bg-blue-600 hover:bg-[#357abd] text-white rounded-lg transition-colors"
        >
          Reintentar
        </button>
        <button
          @click="router.push('/')"
          class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {{ success ? 'Ir al inicio' : 'Volver' }}
        </button>
      </div>
    </div>
  </div>
</template>
