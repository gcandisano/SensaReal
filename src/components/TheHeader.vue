<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faSignOutAlt, faCog, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { registerESP32 } from '@/services/api/esp'

const menuVisible = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const handleClickOutside = (event: MouseEvent) => {
  const menu = document.querySelector('.user-menu')
  const icon = document.querySelector('.profile-icon')

  if (
    menuVisible.value &&
    menu &&
    icon &&
    !menu.contains(event.target as Node) &&
    !icon.contains(event.target as Node)
  ) {
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

// Lógica del modal
const mostrarModal = ref(false)
const nuevoSensorId = ref('')
const limiteTemperaturaMin = ref('20')
const limiteTemperaturaMax = ref('20')
const limiteHumedadMin = ref('50')
const limiteHumedadMax = ref('50')

function abrirModal() {
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

async function agregarSensor() {
  try {
    const data = await registerESP32(nuevoSensorId.value)
    console.log('ESP32 registrado:', data)
    console.log('Límites de temperatura:', limiteTemperaturaMin.value, limiteTemperaturaMax.value)
    console.log('Límites de humedad:', limiteHumedadMin.value, limiteHumedadMax.value)
    cerrarModal()
  } catch (error) {
    console.error('Error al registrar ESP32:', error)
  }
}

watch([limiteTemperaturaMin, limiteTemperaturaMax], ([newMin, newMax]) => {
  if (parseFloat(newMin) > parseFloat(newMax)) {
    limiteTemperaturaMin.value = newMax
  }
  if (parseFloat(newMax) < parseFloat(newMin)) {
    limiteTemperaturaMax.value = newMin
  }
})

watch([limiteHumedadMin, limiteHumedadMax], ([newMin, newMax]) => {
  if (parseFloat(newMin) > parseFloat(newMax)) {
    limiteHumedadMin.value = newMax
  }
  if (parseFloat(newMax) < parseFloat(newMin)) {
    limiteHumedadMax.value = newMin
  }
})

// Agregar event listener para detectar clics fuera del menú
window.addEventListener('click', handleClickOutside)
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      <h1>SensaReal</h1>
    </RouterLink>
    <div class="user-menu-container" style="display: flex; align-items: center">
      <button @click="abrirModal" class="add-sensor-button">+</button>
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
  <!-- Modal para agregar ESP32 -->
  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal" style="background-color: #252c34; color: #fff">
      <h2 style="color: #fff">Agregar ESP32</h2>
      <label for="sensor-id" style="color: #fff">ID del ESP32:</label>
      <input
        type="text"
        id="sensor-id"
        v-model="nuevoSensorId"
        style="background-color: #333; color: #fff; border: 1px solid #555"
      />
      <label for="temp-min" style="color: #fff"
        >Límite de Temperatura Mínima: {{ limiteTemperaturaMin }}</label
      >
      <input
        type="range"
        id="temp-min"
        v-model="limiteTemperaturaMin"
        min="-40"
        max="80"
        step="0.5"
        style="width: 100%"
      />
      <label for="temp-max" style="color: #fff"
        >Límite de Temperatura Máxima: {{ limiteTemperaturaMax }}</label
      >
      <input
        type="range"
        id="temp-max"
        v-model="limiteTemperaturaMax"
        min="-40"
        max="80"
        step="0.5"
        style="width: 100%"
      />
      <label for="humedad-min" style="color: #fff"
        >Límite de Humedad Mínima: {{ limiteHumedadMin }}%</label
      >
      <input
        type="range"
        id="humedad-min"
        v-model="limiteHumedadMin"
        min="0"
        max="100"
        step="1"
        style="width: 100%"
      />
      <label for="humedad-max" style="color: #fff"
        >Límite de Humedad Máxima: {{ limiteHumedadMax }}%</label
      >
      <input
        type="range"
        id="humedad-max"
        v-model="limiteHumedadMax"
        min="0"
        max="100"
        step="1"
        style="width: 100%"
      />
      <button @click="agregarSensor" style="background-color: #4caf50; color: #fff">Agregar</button>
      <button @click="cerrarModal" style="background-color: #e53935; color: #fff">Cancelar</button>
    </div>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #1a1a1a;
}

.add-sensor-button {
  margin-right: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.add-sensor-button:hover {
  background-color: #45a049;
}

.user-icon {
  /* Estilos para el icono de usuario */
}

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin-top: 0;
}

.modal label {
  display: block;
  margin-bottom: 5px;
}

.modal input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.modal button:hover {
  background-color: #45a049;
}

.modal button:last-child {
  background-color: #f44336;
}

.modal button:last-child:hover {
  background-color: #e53935;
}
</style>
