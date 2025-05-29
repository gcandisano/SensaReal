<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faThermometerHalf,
  faTint,
  faMapMarkerAlt,
  faRedo,
  faQuestionCircle,
  faCopy,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { sensorsService } from '@/services/api/sensors'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const router = useRouter()
const name = ref('')
const uuid = ref(generateUUID())
const tempMin = ref('')
const tempMax = ref('')
const humMin = ref('')
const humMax = ref('')
const error = ref('')
const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(uuid.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    toast.error('Error al copiar el UUID')
  }
}

const handleRegisterSensor = async () => {
  try {
    if (
      !name.value ||
      !uuid.value ||
      !tempMin.value ||
      !tempMax.value ||
      !humMin.value ||
      !humMax.value
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

    // Llamada al servicio de sensores
    await sensorsService.createSensor(uuid.value, name.value)

    // Llamadas al servicio de umbrales
    const thresholds = [
      { threshold: Number(tempMin.value), condition: 'below', type: 'temperature' },
      { threshold: Number(tempMax.value), condition: 'above', type: 'temperature' },
      { threshold: Number(humMin.value), condition: 'below', type: 'humidity' },
      { threshold: Number(humMax.value), condition: 'above', type: 'humidity' },
    ]

    for (const threshold of thresholds) {
      await sensorsService.addThreshold(
        uuid.value,
        threshold.threshold,
        threshold.condition,
        threshold.type,
      )
    }

    router.push('/')
  } catch (e) {
    error.value = 'Error al registrar el sensor'
  }
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-start py-8 px-4">
    <div class="w-full max-w-4xl bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col gap-4">
      <div class="text-center mb-8 flex flex-col gap-2">
        <h1 class="text-3xl font-bold text-white mb-2">Nuevo Sensor DHT22</h1>
        <p class="text-gray-300">Configure los parámetros de monitoreo</p>
      </div>

      <form @submit.prevent="handleRegisterSensor" class="flex flex-col gap-4">
        <div class="bg-gray-700 rounded-lg p-6 shadow-sm flex flex-col gap-2">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Información Básica
          </h3>

          <div class="flex flex-col gap-4">
            <div>
              <label
                for="name"
                class="flex items-center text-gray-700 dark:text-gray-300 mb-2 gap-2"
              >
                <font-awesome-icon :icon="faThermometerHalf" class="mr-2" />
                Nombre del Sensor*
              </label>
              <input
                type="text"
                id="name"
                v-model="name"
                required
                placeholder="Ej: Sensor Invernadero 1"
                class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label for="uuid" class="flex items-center text-gray-300 mb-2 gap-2">
                <font-awesome-icon :icon="faMapMarkerAlt" class="mr-2" />
                UUID*
                <div class="relative group">
                  <div
                    class="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center cursor-help"
                    data-tooltip-target="help-tooltip"
                  >
                    <font-awesome-icon :icon="faQuestionCircle" class="text-sm" />
                  </div>
                  <div
                    id="help-tooltip"
                    role="tooltip"
                    class="absolute z-10 invisible group-hover:visible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 tooltip dark:bg-gray-700 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full w-64"
                  >
                    Este UUID debe ser configurado en el ESP32 para que pueda enviar datos al
                    sistema
                    <div
                      class="absolute w-2 h-2 bg-gray-900 dark:bg-gray-700 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"
                    ></div>
                  </div>
                </div>
              </label>
              <div class="flex gap-2">
                <div class="relative flex-1 group">
                  <input
                    type="text"
                    id="uuid"
                    v-model="uuid"
                    disabled
                    required
                    class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-400 font-mono cursor-not-allowed pr-12"
                  />
                  <button
                    type="button"
                    @click="copyToClipboard"
                    class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center hover:bg-[#357abd] transition-colors"
                    :title="copied ? 'Copiado!' : 'Copiar UUID'"
                  >
                    <font-awesome-icon :icon="copied ? faCheck : faCopy" class="text-sm" />
                  </button>
                </div>
                <button
                  type="button"
                  @click="uuid = generateUUID()"
                  title="Generar nuevo UUID"
                  class="px-4 py-2 bg-gray-800 hover:bg-[#357abd] text-white rounded-lg transition-colors cursor-pointer"
                >
                  <font-awesome-icon :icon="faRedo" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-700 rounded-lg p-6 shadow-sm flex flex-col gap-2">
          <h3 class="text-xl font-semibold text-white mb-2">Configuración de Alertas</h3>
          <p class="text-gray-300 mb-6">Define los rangos seguros para el monitoreo</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-xl overflow-hidden">
              <div class="p-6 text-center bg-gradient-to-br from-red-400 to-red-500">
                <font-awesome-icon :icon="faThermometerHalf" class="text-4xl text-white" />
              </div>
              <div class="p-6 bg-gray-800 flex flex-col gap-2">
                <h4 class="text-lg font-semibold text-white mb-2">Temperatura (°C)</h4>
                <p class="text-gray-300 mb-4">Rango seguro de temperatura</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="temp-min" class="block text-sm text-gray-300 mb-1">Mínima*</label>
                    <div class="relative">
                      <input
                        type="number"
                        id="temp-min"
                        v-model="tempMin"
                        required
                        step="0.1"
                        placeholder="18"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <span class="absolute right-3 top-2 text-gray-500">°C</span>
                    </div>
                  </div>
                  <div>
                    <label for="temp-max" class="block text-sm text-gray-300 mb-1">Máxima*</label>
                    <div class="relative">
                      <input
                        type="number"
                        id="temp-max"
                        v-model="tempMax"
                        required
                        step="0.1"
                        placeholder="28"
                        class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <span class="absolute right-3 top-2 text-gray-500">°C</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl overflow-hidden">
              <div class="p-6 text-center bg-gradient-to-br from-blue-400 to-blue-500">
                <font-awesome-icon :icon="faTint" class="text-4xl text-white" />
              </div>
              <div class="p-6 bg-gray-800 flex flex-col gap-2">
                <h4 class="text-lg font-semibold text-white mb-2">Humedad (%)</h4>
                <p class="text-gray-300 mb-4">Rango seguro de humedad</p>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="hum-min" class="block text-sm text-gray-300 mb-1">Mínima*</label>
                    <div class="relative">
                      <input
                        type="number"
                        id="hum-min"
                        v-model="humMin"
                        required
                        step="1"
                        placeholder="30"
                        class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span class="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>
                  <div>
                    <label for="hum-max" class="block text-sm text-gray-300 mb-1">Máxima*</label>
                    <div class="relative">
                      <input
                        type="number"
                        id="hum-max"
                        v-model="humMax"
                        required
                        step="1"
                        placeholder="70"
                        class="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span class="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full py-3 px-6 bg-[#295f95] hover:bg-[#357abd] text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Registrar Sensor
        </button>
      </form>
    </div>
  </div>
</template>
