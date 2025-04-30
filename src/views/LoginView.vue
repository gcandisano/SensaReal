<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons'
import LoginForm from '@/components/auth/LoginForm.vue'
import SignUpForm from '@/components/auth/SignUpForm.vue'

const route = useRoute()
const isLoginRoute = computed(() => route.path === '/login')
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row items-center justify-center gap-24">
    <div class="flex flex-col items-center justify-center p-8">
      <div class="text-center text-white transform transition-all duration-500 hover:scale-105">
        <FontAwesomeIcon :icon="faCloudSunRain" class="text-8xl mb-6 animate-pulse text-[#4a90e2]" />
        <div class="flex flex-col items-center justify-center p-8 gap-4">
          <h1 class="text-4xl font-bold mb-4 text-(--color-heading)">Bienvenido a Sensareal!</h1>
          <p class="text-xl opacity-90 text-(--color-text)">Monitorea en tiempo real la temperatura y<br> humedad con
            nuestra plataforma.</p>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-center p-8">
      <component :is="isLoginRoute ? LoginForm : SignUpForm" />
    </div>
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
