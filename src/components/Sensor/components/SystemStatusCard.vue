<script setup lang="ts">
defineProps<{
  isConnected: boolean
  message: string
  lastUpdate: string
}>()
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 shadow-lg">
    <h3 class="text-lg font-semibold text-white mb-4">Estado del Sistema</h3>
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Estado:</span>
        <span :class="['font-medium', isConnected ? 'text-green-500' : 'text-red-500']">
          {{ message }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-gray-400">Última actualización:</span>
        <span class="text-white">{{ lastUpdate }}</span>
      </div>
    </div>
  </div>
</template>
