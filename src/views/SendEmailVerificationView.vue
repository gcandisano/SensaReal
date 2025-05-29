<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const authStore = useAuthStore()

const handleSendEmailVerification = async () => {
  const email = authStore.user?.email
  if (email) {
    try {
      await authService.sendEmailVerification(email)
      toast.success('Correo de verificación enviado')
    } catch (error) {
      toast.error('Error al enviar el correo de verificación')
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
    <div
      class="w-full max-w-[500px] bg-[#2C2C2C] p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8 text-center"
    >
      <FontAwesomeIcon :icon="faEnvelope" class="text-[#4C8FE9] text-6xl animate-bounce" />

      <div class="space-y-4">
        <h1 class="text-3xl font-normal text-white">Verifica tu correo electrónico</h1>
        <p class="text-gray-400 text-lg">
          Hemos enviado un enlace de verificación a tu correo electrónico. Por favor, revisa tu
          bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>
      </div>

      <div class="space-y-4 text-gray-400">
        <p class="text-sm">¿No recibiste el correo? Revisa tu carpeta de spam o</p>
        <button
          class="text-[#4C8FE9] hover:text-[#4080D5] transition-colors text-sm underline"
          @click="handleSendEmailVerification"
        >
          solicita un nuevo enlace
        </button>
      </div>

      <RouterLink to="/login" class="text-[#4C8FE9] hover:text-[#4080D5] transition-colors mt-4">
        Volver al inicio de sesión
      </RouterLink>
    </div>
  </div>
</template>
