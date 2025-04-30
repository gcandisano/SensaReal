<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSearch, faSort, faSortUp, faSortDown, faMicrochip } from '@fortawesome/free-solid-svg-icons'
import type { Sensor } from '@/types/sensors'
import SensorListItem from '@/components/SensorList/SensorListItem.vue'
import { sensorsService } from '@/services/api/sensors'
import { useRouter } from 'vue-router'

const sensors = ref<Sensor[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

const filterOptions = ['Todos', 'Asignado', 'No asignado'] as const
type FilterOption = (typeof filterOptions)[number]

const searchQuery = ref('')
const sortField = ref<'name' | 'temperature' | 'humidity'>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const activeFilter = ref<FilterOption>('Todos')

const filteredAndSortedSensors = computed(() => {
  if (!sensors.value) return []

  let result = [...sensors.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((sensor) => sensor?.name?.toLowerCase().includes(query))
  }

  // Apply active status filter
  if (activeFilter.value !== 'Todos') {
    result = result.filter((sensor) =>
      activeFilter.value === 'Asignado'
        ? sensor?.status === 'ASSIGNED'
        : sensor?.status === 'UNASSIGNED',
    )
  }

  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0
    if (sortField.value === 'name') {
      comparison = (a?.name || '').localeCompare(b?.name || '')
    } else if (sortField.value === 'temperature') {
      comparison = (a?.lastReading?.temperature || 0) - (b?.lastReading?.temperature || 0)
    } else if (sortField.value === 'humidity') {
      comparison = (a?.lastReading?.humidity || 0) - (b?.lastReading?.humidity || 0)
    }
    return sortDirection.value === 'asc' ? comparison : -comparison
  })

  return result
})

const toggleSort = (field: 'name' | 'temperature' | 'humidity') => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field: 'name' | 'temperature' | 'humidity') => {
  if (sortField.value !== field) return faSort
  return sortDirection.value === 'asc' ? faSortUp : faSortDown
}

const fetchSensors = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await sensorsService.getSensors()
    sensors.value = response
    console.log(sensors.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

const handleDeleteSensor = async (id: string) => {
  try {
    await sensorsService.deleteSensor(id)
    sensors.value = sensors.value.filter((sensor) => sensor.id !== id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred'
  }
}

const handleUpdateSensor = async (sensor: Sensor) => {
  sensors.value = sensors.value.map((s) => (s.sensorId === sensor.sensorId ? sensor : s))
}

onMounted(() => {
  fetchSensors()
})
</script>

<template>
  <div v-if="loading" class="text-center py-8">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a90e2] mx-auto"></div>
    <p class="mt-4 text-gray-600">Cargando sensores...</p>
  </div>

  <div v-else-if="error" class="text-center py-8">
    <p class="text-red-500">{{ error }}</p>
    <button
      @click="fetchSensors"
      class="mt-4 px-4 py-2 bg-[#4a90e2] text-white rounded-lg hover:bg-[#357abd] transition-colors duration-300"
    >
      Retry
    </button>
  </div>

  <div v-else class="flex flex-col gap-4 min-h-[calc(100vh-200px)]">
    <!-- No Sensors State -->
    <div v-if="filteredAndSortedSensors.length === 0" class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-[500px] bg-[#2C2C2C] p-8 rounded-2xl shadow-xl flex flex-col items-center gap-6 text-center">
        <FontAwesomeIcon 
          :icon="faMicrochip" 
          class="text-[#4C8FE9] text-6xl animate-bounce"
        />
        <p class="text-3xl font-normal text-white">No hay sensores añadidos aún</p>
        <button 
          class="px-6 py-2 bg-[#4C8FE9] text-white rounded-lg hover:bg-[#4080D5] transition-colors duration-300 cursor-pointer" 
          @click="addDevice"
        >
          Añadir Sensor
        </button>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar sensor..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-[#2C2C2C] text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4a90e2] focus:border-transparent"
          />
          <FontAwesomeIcon
            :icon="faSearch"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      <div class="flex gap-2">
        <button
          v-for="filter in filterOptions"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-4 py-2 rounded-lg transition-colors duration-300',
            activeFilter === filter
              ? 'bg-[#4a90e2] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ filter.charAt(0).toUpperCase() + filter.slice(1) }}
        </button>
      </div>
    </div>

    <!-- Sort Headers -->
    <div class="flex gap-4 text-sm text-gray-300">
      <button
        @click="toggleSort('name')"
        class="flex items-center gap-1 hover:text-[#4a90e2] transition-colors duration-300"
      >
        Nombre
        <FontAwesomeIcon :icon="getSortIcon('name')" />
      </button>
      <button
        @click="toggleSort('temperature')"
        class="flex items-center gap-1 hover:text-[#4a90e2] transition-colors duration-300"
      >
        Temperatura
        <FontAwesomeIcon :icon="getSortIcon('temperature')" />
      </button>
      <button
        @click="toggleSort('humidity')"
        class="flex items-center gap-1 hover:text-[#4a90e2] transition-colors duration-300"
      >
        Humedad
        <FontAwesomeIcon :icon="getSortIcon('humidity')" />
      </button>
    </div>

    <!-- Sensor List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SensorListItem
        v-for="sensor in filteredAndSortedSensors"
        :key="sensor.id"
        :sensor="sensor"
        @delete="handleDeleteSensor"
        @update="handleUpdateSensor"
      />
    </div>
  </div>
</template>
