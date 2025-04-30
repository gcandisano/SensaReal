<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, 
  faSignOutAlt, 
  faMicrochip, 
  faPlus, 
} from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/api/auth'
const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)

const navigateToSensors = () => {
  router.push('/sensors')
}

const addDevice = () => {
  router.push('/add-device')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = async () => {
  try {
    await authService.logout()
    authStore.clearAuth()
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 bg-[#1E1E1E] shadow-lg z-50">
    <div class="flex items-center">
      <RouterLink to="/" class="text-2xl font-normal text-white hover:text-[#4C8FE9] transition-colors">
        SensaReal
      </RouterLink>
    </div>

    <div class="flex gap-6 items-center">
      <button 
        class="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer"
        @click="navigateToSensors"
      >
        <FontAwesomeIcon :icon="faMicrochip" class="text-lg" />
        <span class="text-sm">Sensores</span>
      </button>

      <button 
        class="flex items-center justify-center w-10 h-10 rounded-full bg-[#2C2C2C] text-gray-400 hover:text-white hover:bg-[#357abd] transition-all duration-200"
        @click="addDevice"
        title="Agregar dispositivo"
      >
        <FontAwesomeIcon :icon="faPlus" class="text-lg" />
      </button>

      <div class="relative">
        <button 
          class="flex items-center justify-center w-10 h-10 rounded-full bg-[#2C2C2C] text-gray-400 hover:text-white hover:bg-[#357abd] transition-all duration-200"
          @click="toggleUserMenu"
          title="Menú de usuario"
        >
          <FontAwesomeIcon :icon="faUser" class="text-lg" />
        </button>

        <!-- User Menu Dropdown -->
        <div v-if="showUserMenu" 
          class="absolute right-0 mt-2 w-48 rounded-lg bg-[#2C2C2C] shadow-xl py-2 z-50"
        >
          <div class="px-4 py-2 border-b border-gray-700">
            <p class="text-white font-medium">{{ authStore.user?.name }}</p>
            <p class="text-sm text-gray-400">{{ authStore.user?.email }}</p>
          </div>
          <button 
            @click="logout"
            class="w-full px-4 py-2 text-left text-gray-400 hover:text-white hover:bg-[#357abd] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon :icon="faSignOutAlt" class="text-lg" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Spacer to prevent content from going under fixed header -->
  <div class="h-[72px]"></div>
</template>