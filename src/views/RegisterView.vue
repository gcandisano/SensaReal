<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

const handleRegister = async () => {
  try {
    if (!email.value || !password.value || !confirmPassword.value) {
      error.value = 'Por favor complete todos los campos'
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Las contraseñas no coinciden'
      return
    }

    // Aquí irá la lógica de registro
    router.push('/login')
  } catch (e) {
    error.value = 'Error al registrar usuario'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Registro</h1>

      <form @submit.prevent="handleRegister" class="auth-form">
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

        <button type="submit" class="auth-button">Registrarse</button>

        <div class="auth-link">
          ¿Ya tienes una cuenta? <RouterLink to="/login">Inicia sesión aquí</RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
