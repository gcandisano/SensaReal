<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThermometerHalf, faDroplet } from '@fortawesome/free-solid-svg-icons'
import type { Sensor } from '@/types/sensors'
import { DateUtils } from '@/utils/date'
import { useRouter } from 'vue-router'

interface Props {
  sensor: Sensor
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToSensor = () => {
  console.log('propiedades', props.sensor)
  router.push(`/sensors/${props.sensor.id}`)
}
</script>

<template>
  <div
    class="flex flex-col gap-3 bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300 border border-gray-700 cursor-pointer"
    @click="navigateToSensor"
  >
    <div class="flex justify-between items-start">
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <h3 class="text-xl font-semibold text-[#4a90e2]">
            {{ sensor?.name || 'Sensor sin nombre' }}
          </h3>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <span
            :class="[
              'px-2 py-1 rounded-full text-sm font-medium',
              sensor?.status === 'ASSIGNED'
                ? 'bg-green-900/50 text-green-400 border border-green-500/30'
                : 'bg-red-900/50 text-red-400 border border-red-500/30',
            ]"
          >
            {{ sensor?.status === 'ASSIGNED' ? 'Asignado' : 'No asignado' }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 mt-4">
      <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
        <FontAwesomeIcon :icon="faThermometerHalf" class="text-[#4a90e2] text-lg" />
        <span class="text-gray-300">{{ sensor?.lastReading?.temperature || 0 }}°C</span>
      </div>
      <div class="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
        <FontAwesomeIcon :icon="faDroplet" class="text-[#4a90e2] text-lg" />
        <span class="text-gray-300">{{ sensor?.lastReading?.humidity || 0 }}%</span>
      </div>
      <div class="text-sm text-gray-400 mt-2">
        Última actualización:
        {{
          sensor?.lastReading?.timestamp
            ? DateUtils.formatDate(sensor.lastReading.timestamp)
            : 'Nunca'
        }}
      </div>
    </div>
  </div>
</template>
