<script setup lang="ts">
defineProps<{
  temperatureRange: { min: number; max: number }
  humidityRange: { min: number; max: number }
}>()
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 shadow-lg">
    <h3 class="text-lg font-semibold text-white mb-4">Rangos Óptimos</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <i class="fas fa-temperature-high text-[#FF6384]"></i>
        <span class="text-gray-400">Temperatura:</span>
        <span class="text-white">{{ temperatureRange.min }}°C - {{ temperatureRange.max }}°C</span>
      </div>
      <div class="flex items-center gap-3">
        <i class="fas fa-tint text-[#36A2EB]"></i>
        <span class="text-gray-400">Humedad:</span>
        <span class="text-white">{{ humidityRange.min }}% - {{ humidityRange.max }}%</span>
      </div>
    </div>
  </div>
</template>
