<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'

const menuVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const handleClickOutside = (event) => {
  const menu = document.querySelector('.user-menu')
  const icon = document.querySelector('.profile-icon')
  
  if (menuVisible.value && menu && icon && !menu.contains(event.target) && !icon.contains(event.target)) {
    menuVisible.value = false
  }
}

const logout = async () => {
  try {
    // Llamar al servicio de logout si es necesario
    // await authService.logout()
    
    // Limpiar el estado de autenticación
    authStore.clearAuth()
    
    // Redirigir al login
    router.push('/login')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

// Agregar event listener para detectar clics fuera del menú
window.addEventListener('click', handleClickOutside)
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      <h1>SensaReal</h1>
    </RouterLink>

    <div class="user-menu-container">
      <div class="profile-icon" @click.stop="toggleMenu">
        <FontAwesomeIcon :icon="faUser" />
      </div>
      
      <div v-if="menuVisible" class="user-menu">
        <div class="menu-header">
          <span class="user-name">{{ authStore.user?.name || 'Usuario' }}</span>
          <span class="user-email">{{ authStore.user?.email || 'usuario@ejemplo.com' }}</span>
        </div>
        
        <div class="menu-items">
          <RouterLink to="/profile" class="menu-item">
            <FontAwesomeIcon :icon="faUser" class="menu-icon" />
            <span>Mi Perfil</span>
          </RouterLink>
          
          <RouterLink to="/settings" class="menu-item">
            <FontAwesomeIcon :icon="faCog" class="menu-icon" />
            <span>Configuración</span>
          </RouterLink>
          
          <div class="menu-divider"></div>
          
          <div class="menu-item logout" @click="logout">
            <FontAwesomeIcon :icon="faSignOutAlt" class="menu-icon" />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.user-menu-container {
  position: relative;
}

.profile-icon {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.profile-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 240px;
  background-color: var(--color-background);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
}

.menu-header {
  padding: 16px;
  background-color: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: var(--color-heading);
  margin-bottom: 4px;
}

.user-email {
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.8;
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.menu-item:hover {
  background-color: var(--color-background-soft);
}

.menu-icon {
  margin-right: 12px;
  width: 16px;
  opacity: 0.8;
}

.menu-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 8px 0;
}

.logout {
  color: #e53935;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
