<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  type: 'temperature' | 'humidity'
  value: number
  range: { min: number; max: number }
}>()

const getStatus = computed(() => {
  if (props.type === 'temperature') {
    if (props.value >= props.range.min && props.value <= props.range.max) {
      return 'optimo'
    } else if (props.value < props.range.min - 3 || props.value > props.range.max + 2) {
      return 'peligro'
    } else {
      return 'alerta'
    }
  } else {
    if (props.value >= props.range.min && props.value <= props.range.max) {
      return 'optimo'
    } else if (props.value < props.range.min - 10 || props.value > props.range.max + 10) {
      return 'peligro'
    } else {
      return 'alerta'
    }
  }
})

const getMessage = computed(() => {
  if (props.type === 'temperature') {
    if (props.value >= props.range.min && props.value <= props.range.max) {
      return 'Temperatura óptima'
    } else if (props.value < props.range.min) {
      return 'Temperatura demasiado baja'
    } else if (props.value > props.range.max) {
      return 'Temperatura demasiado alta'
    } else {
      return 'Temperatura en rango de alerta'
    }
  } else {
    if (props.value >= props.range.min && props.value <= props.range.max) {
      return 'Humedad óptima'
    } else if (props.value < props.range.min) {
      return 'Humedad demasiado baja'
    } else if (props.value > props.range.max) {
      return 'Humedad demasiado alta'
    } else {
      return 'Humedad en rango de alerta'
    }
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'optimo':
      return 'bg-green-500'
    case 'alerta':
      return 'bg-orange-500'
    case 'peligro':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const getValueColor = (type: string) => {
  return type === 'temperature' ? 'text-[#FF6384]' : 'text-[#36A2EB]'
}

const getUnit = (type: string) => {
  return type === 'temperature' ? '°C' : '%'
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 shadow-lg h-full flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-white mb-2">
      {{ type === 'temperature' ? 'Temperatura' : 'Humedad' }}
    </h2>
    <div :class="['text-4xl font-bold mb-2', getValueColor(type)]">
      {{ value.toFixed(1) }}{{ getUnit(type) }}
    </div>
    <p class="text-gray-400 text-sm mb-2">
      {{ type === 'temperature' ? 'Temperatura ambiente actual' : 'Humedad relativa del aire' }}
    </p>
    <div class="mt-auto">
      <div
        :class="[
          'text-white text-sm font-medium px-3 py-1 rounded-full inline-block',
          getStatusColor(getStatus),
        ]"
      >
        {{ getMessage }}
      </div>
    </div>
  </div>
</template>
