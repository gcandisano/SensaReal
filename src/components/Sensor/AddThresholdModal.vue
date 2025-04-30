<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import type { Sensor } from '@/types/sensors'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import api from '@/services/api'
import { sensorsService } from '@/services/api/sensors'

interface Props {
  isOpen: boolean
  sensor: Sensor
}

interface Emits {
  (e: 'close'): void
  (e: 'threshold-added'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const threshold = ref('')
const condition = ref<'above' | 'below'>('above')
const type = ref<'temperature' | 'humidity'>('temperature')
const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    const response = await sensorsService.addThreshold(props.sensor.sensorId, parseFloat(threshold.value), condition.value, type.value)
    console.log(response)
    toast.success('Umbral agregado correctamente')
    emit('threshold-added')
    emit('close')
  } catch (error) {
    toast.error('Error al agregar el umbral')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Agregar umbral"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="threshold-type" class="block text-sm font-medium text-gray-300">Tipo de umbral</label>
        <select
          id="threshold-type"
          v-model="type"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
          :disabled="isLoading"
        >
          <option value="temperature">Temperatura</option>
          <option value="humidity">Humedad</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label for="threshold-condition" class="block text-sm font-medium text-gray-300">Condición</label>
        <select
          id="threshold-condition"
          v-model="condition"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
          :disabled="isLoading"
        >
          <option value="above">Por encima de</option>
          <option value="below">Por debajo de</option>
        </select>
      </div>

      <div class="flex flex-col gap-2">
        <label for="threshold-value" class="block text-sm font-medium text-gray-300">Valor</label>
        <input
          id="threshold-value"
          v-model="threshold"
          type="number"
          step="0.1"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
          :placeholder="type === 'temperature' ? 'Ej: 25.5' : 'Ej: 60'"
          :disabled="isLoading"
        />
      </div>

      <div class="flex justify-end gap-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors duration-300 cursor-pointer"
          :disabled="isLoading"
        >
          Cancelar
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-[#4a90e2] text-white rounded-md hover:bg-[#357abd] transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading || !threshold"
        >
          <span v-if="isLoading" class="flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
          </span>
          <span v-else>Guardar</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template> 