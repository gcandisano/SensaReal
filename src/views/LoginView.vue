<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

const handleLogin = async () => {
  try {
    // Aquí irá la lógica de autenticación
    // Por ahora solo simularemos el login
    if (email.value && password.value) {
      // Redirigir al dashboard después del login exitoso
      router.push('/')
    } else {
      error.value = 'Por favor complete todos los campos'
    }
  } catch (e) {
    error.value = 'Error al iniciar sesión'
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

        <button type="submit" class="auth-button">Iniciar Sesión</button>

        <div class="auth-link">
          ¿No tienes una cuenta? <RouterLink to="/register">Regístrate aquí</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
