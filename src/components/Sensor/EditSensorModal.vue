<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import type { Sensor } from '@/types/sensors'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { sensorsService } from '@/services/api/sensors'

interface Props {
  isOpen: boolean
  sensor: Sensor
}

interface Emits {
  (e: 'close'): void
  (e: 'update', sensor: Sensor): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const newSensorName = ref(props.sensor?.name || '')
const isLoading = ref(false)

const handleSave = async () => {
  try {
    isLoading.value = true
    const status = await sensorsService.updateSensorName(props.sensor.sensorId, newSensorName.value)
    
    if (status === 200) {
      toast.success('Nombre del sensor actualizado correctamente')
      const updatedSensor = { ...props.sensor, name: newSensorName.value }
      emit('update', updatedSensor)
    } else {
      toast.error('Error al actualizar el nombre del sensor')
    }
  } catch (error) {
    toast.error('Error al actualizar el nombre del sensor')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <BaseModal
    :is-open="isOpen"
    title="Editar nombre del sensor"
    @close="emit('close')"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="sensor-name" class="block text-sm font-medium text-gray-300 mb-2">Nombre del sensor</label>
        <input
          id="sensor-name"
          v-model="newSensorName"
          type="text"
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
          placeholder="Ingrese el nombre del sensor"
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
          @click="handleSave"
          class="px-4 py-2 bg-[#4a90e2] text-white rounded-md hover:bg-[#357abd] transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
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