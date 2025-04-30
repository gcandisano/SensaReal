<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#1E1E1E] p-4">
    <div class="w-full max-w-[500px] bg-[#2C2C2C] p-8 rounded-2xl shadow-xl flex flex-col items-center gap-8 text-center">
      <FontAwesomeIcon 
        :icon="faEnvelope" 
        class="text-[#4C8FE9] text-6xl animate-bounce"
      />
      
      <div class="space-y-4">
        <h1 class="text-3xl font-normal text-white">Verifica tu correo electrónico</h1>
        <p class="text-gray-400 text-lg">
          Hemos enviado un enlace de verificación a tu correo electrónico.
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>
      </div>

      <div class="space-y-4 text-gray-400">
        <p class="text-sm">
          ¿No recibiste el correo? Revisa tu carpeta de spam o
        </p>
        <button 
          class="text-[#4C8FE9] hover:text-[#4080D5] transition-colors text-sm underline"
        >
          solicita un nuevo enlace
        </button>
      </div>

      <RouterLink 
        to="/login" 
        class="text-[#4C8FE9] hover:text-[#4080D5] transition-colors mt-4"
      >
        Volver al inicio de sesión
      </RouterLink>
    </div>
  </div>
</template> 