<script setup lang="ts">
import type { SensorAlert } from '@/types/sensors'

defineProps<{
  alert: SensorAlert
  alertType: 'temperature' | 'humidity' | null
}>()

const getUnit = (type: string | null) => {
  return type === 'temperature' ? '°C' : '%'
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 shadow-lg h-full flex flex-col">
    <h3 class="text-lg font-semibold text-white mb-4">Última Alerta</h3>
    <div class="space-y-3 flex-1">
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Tipo:</span>
        <span class="text-white">{{
          alertType === 'temperature' ? 'Temperatura' : 'Humedad'
        }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Valor registrado:</span>
        <span class="text-white">{{ alert.actualValue }}{{ getUnit(alertType) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Valor límite:</span>
        <span class="text-white">{{ alert.thresholdValue }}{{ getUnit(alertType) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Fecha:</span>
        <span class="text-white">{{ new Date(alert.sentAt).toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>
