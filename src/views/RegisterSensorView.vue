<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faThermometerHalf,
  faTint,
  faMapMarkerAlt,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const nombre = ref('')
const ubicacion = ref('')
const descripcion = ref('')
const tempMin = ref('')
const tempMax = ref('')
const humMin = ref('')
const humMax = ref('')
const email = ref('')
const error = ref('')

const handleRegisterSensor = async () => {
  try {
    if (
      !nombre.value ||
      !ubicacion.value ||
      !tempMin.value ||
      !tempMax.value ||
      !humMin.value ||
      !humMax.value ||
      !email.value
    ) {
      error.value = 'Por favor complete los campos requeridos'
      return
    }

    if (Number(tempMin.value) >= Number(tempMax.value)) {
      error.value = 'La temperatura mínima debe ser menor que la máxima'
      return
    }

    if (Number(humMin.value) >= Number(humMax.value)) {
      error.value = 'La humedad mínima debe ser menor que la máxima'
      return
    }

    console.log('Sensor registrado:', {
      nombre: nombre.value,
      ubicacion: ubicacion.value,
      descripcion: descripcion.value,
      tipo: 'DHT22',
      limites: {
        temperatura: {
          min: Number(tempMin.value),
          max: Number(tempMax.value),
        },
        humedad: {
          min: Number(humMin.value),
          max: Number(humMax.value),
        },
      },
      emailNotificacion: email.value,
    })

    router.push('/')
  } catch (e) {
    error.value = 'Error al registrar el sensor'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="sensor-register-box">
      <div class="sensor-header">
        <h1>Nuevo Sensor DHT22</h1>
        <p class="subtitle">Configure los parámetros de monitoreo</p>
      </div>

      <form @submit.prevent="handleRegisterSensor" class="sensor-form">
        <div class="form-section">
          <h3>Información Básica</h3>
          <div class="form-group">
            <label for="nombre">
              <font-awesome-icon :icon="faThermometerHalf" class="icon" />
              Nombre del Sensor*
            </label>
            <input
              type="text"
              id="nombre"
              v-model="nombre"
              required
              placeholder="Ej: Sensor Invernadero 1"
            />
          </div>

          <div class="form-group">
            <label for="ubicacion">
              <font-awesome-icon :icon="faMapMarkerAlt" class="icon" />
              Ubicación*
            </label>
            <input
              type="text"
              id="ubicacion"
              v-model="ubicacion"
              required
              placeholder="Ej: Invernadero Principal"
            />
          </div>
        </div>

        <div class="form-section limits-section">
          <h3>Configuración de Alertas</h3>
          <p class="section-description">Define los rangos seguros para el monitoreo</p>

          <div class="limits-container">
            <div class="limit-card temperature">
              <div class="limit-icon-wrapper">
                <font-awesome-icon :icon="faThermometerHalf" class="limit-icon" />
              </div>
              <div class="limit-content">
                <h4>Temperatura (°C)</h4>
                <p class="limit-description">Rango seguro de temperatura</p>
                <div class="limit-inputs">
                  <div class="input-group">
                    <label for="temp-min">Mínima*</label>
                    <div class="input-wrapper">
                      <input
                        type="number"
                        id="temp-min"
                        v-model="tempMin"
                        required
                        step="0.1"
                        placeholder="18"
                      />
                      <span class="unit">°C</span>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="temp-max">Máxima*</label>
                    <div class="input-wrapper">
                      <input
                        type="number"
                        id="temp-max"
                        v-model="tempMax"
                        required
                        step="0.1"
                        placeholder="28"
                      />
                      <span class="unit">°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="limit-card humidity">
              <div class="limit-icon-wrapper">
                <font-awesome-icon :icon="faTint" class="limit-icon" />
              </div>
              <div class="limit-content">
                <h4>Humedad (%)</h4>
                <p class="limit-description">Rango seguro de humedad</p>
                <div class="limit-inputs">
                  <div class="input-group">
                    <label for="hum-min">Mínima*</label>
                    <div class="input-wrapper">
                      <input
                        type="number"
                        id="hum-min"
                        v-model="humMin"
                        required
                        step="1"
                        placeholder="30"
                      />
                      <span class="unit">%</span>
                    </div>
                  </div>
                  <div class="input-group">
                    <label for="hum-max">Máxima*</label>
                    <div class="input-wrapper">
                      <input
                        type="number"
                        id="hum-max"
                        v-model="humMax"
                        required
                        step="1"
                        placeholder="70"
                      />
                      <span class="unit">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="submit-button">Registrar Sensor</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  flex: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;
  margin-bottom: 100px;
}

.sensor-register-box {
  background-color: var(--color-background-soft);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
}

.sensor-info {
  background-color: var(--color-background);
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.sensor-info h3 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.sensor-info p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-background);
  color: var(--color-text);
  resize: vertical;
}

.sensor-header {
  text-align: center;
  margin-bottom: 2rem;
}

.sensor-header h1 {
  color: var(--color-heading);
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text);
  opacity: 0.8;
}

.sensor-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--color-background);
  padding: 1.5rem;
  border-radius: 8px;
}

.form-section h3 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.icon {
  margin-right: 0.5rem;
}

.limits-section {
  background: var(--color-background);
}

.section-description {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.limits-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.limit-card {
  background: var(--color-background-soft);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.limit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.limit-icon-wrapper {
  background: linear-gradient(45deg, var(--color-background) 0%, var(--color-background-soft) 100%);
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
}

.temperature .limit-icon-wrapper {
  background: linear-gradient(45deg, #ff6384 0%, #ff8c94 100%);
}

.humidity .limit-icon-wrapper {
  background: linear-gradient(45deg, #36a2eb 0%, #4fc3f7 100%);
}

.limit-icon {
  font-size: 2rem;
  color: white;
}

.limit-content {
  padding: 1.5rem;
}

.limit-content h4 {
  color: var(--color-heading);
  margin: 0;
  font-size: 1.2rem;
}

.limit-description {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0.5rem 0 1.5rem;
  font-size: 0.9rem;
}

.limit-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

.unit {
  position: absolute;
  right: 0.75rem;
  color: var(--color-text);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .limits-container {
    grid-template-columns: 1fr;
  }
}

.submit-button {
  background-color: var(--color-primary);
  color: var(--color-background);
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: var(--color-primary-hover);
}

.error-message {
  color: var(--color-error);
  margin-top: 1rem;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}
</style>
