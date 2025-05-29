<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { sensorsService } from '@/services/api/sensors'
import type { SensorThreshold, SensorAlert } from '@/types/sensors'
import { useRoute } from 'vue-router'
import MetricsCard from '@/components/Sensor/components/MetricsCard.vue'
import SystemStatusCard from '@/components/Sensor/components/SystemStatusCard.vue'
import OptimalRangesCard from '@/components/Sensor/components/OptimalRangesCard.vue'
import LastAlertCard from '@/components/Sensor/components/LastAlertCard.vue'
import ChartSection from '@/components/Sensor/components/ChartSection.vue'

const route = useRoute()
const sensorId = ref(route.params.id as string)

const temperature = ref(0)
const humidity = ref(0)
let interval: number | null = null

const chartData = ref<{
  labels: string[]
  datasets: { label: string; data: number[]; borderColor: string; tension: number }[]
}>({
  labels: [],
  datasets: [
    {
      label: 'Temperatura (°C)',
      data: [],
      borderColor: '#FF6384',
      tension: 0.1,
    },
    {
      label: 'Humedad (%)',
      data: [],
      borderColor: '#36A2EB',
      tension: 0.1,
    },
  ],
})

const temperatureRange = ref({ min: 0, max: 0 })
const humidityRange = ref({ min: 0, max: 0 })

const lastAlert = ref<SensorAlert | null>(null)
const temperatureThresholds = ref<SensorThreshold[]>([])
const humidityThresholds = ref<SensorThreshold[]>([])

const lastMeasurementTime = ref('')
const systemStatus = ref({
  isConnected: false,
  message: 'Sin conexión',
})

const getAlertType = computed(() => {
  if (!lastAlert.value) return null
  const tempThreshold = temperatureThresholds.value.find(
    (t: SensorThreshold) => t.threshold === lastAlert.value?.thresholdValue,
  )
  return tempThreshold ? 'temperature' : 'humidity'
})

const measurementsCount = computed(() => {
  return chartData.value.labels.length
})

interface SensorReading {
  id: string
  userId: string
  sensorId: string
  temperature: number
  humidity: number
  timestamp: string
  batteryLevel: number | null
  signalStrength: number | null
  createdAt: string
  updatedAt: string
}

const fetchSensorThresholds = async () => {
  if (!sensorId.value) return
  try {
    const thresholds = await sensorsService.getSensorThresholds(sensorId.value)
    temperatureThresholds.value = thresholds.filter((t) => t.type === 'temperature' && t.isActive)
    humidityThresholds.value = thresholds.filter((t) => t.type === 'humidity' && t.isActive)

    if (temperatureThresholds.value.length > 0) {
      const aboveTemp = temperatureThresholds.value.find((t) => t.condition === 'above')
      const belowTemp = temperatureThresholds.value.find((t) => t.condition === 'below')
      if (aboveTemp && belowTemp) {
        temperatureRange.value = {
          min: belowTemp.threshold,
          max: aboveTemp.threshold,
        }
      }
    }

    if (humidityThresholds.value.length > 0) {
      const aboveHum = humidityThresholds.value.find((t) => t.condition === 'above')
      const belowHum = humidityThresholds.value.find((t) => t.condition === 'below')
      if (aboveHum && belowHum) {
        humidityRange.value = {
          min: belowHum.threshold,
          max: aboveHum.threshold,
        }
      }
    }
  } catch (error) {
    console.error('Error fetching sensor thresholds:', error)
  }
}

const fetchSensorData = async () => {
  if (!sensorId.value) return
  try {
    const data = await sensorsService.getSensorData(sensorId.value)
    const results: SensorReading[] = data.results

    results.sort(
      (a: SensorReading, b: SensorReading) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    if (results.length > 0) {
      const latestReading = results[results.length - 1]
      temperature.value = latestReading.temperature
      humidity.value = latestReading.humidity
      lastMeasurementTime.value = new Date(latestReading.timestamp).toLocaleTimeString()

      const lastReadingTime = new Date(latestReading.timestamp).getTime()
      const currentTime = new Date().getTime()
      const timeDiff = currentTime - lastReadingTime

      systemStatus.value = {
        isConnected: timeDiff < 60000,
        message: timeDiff < 60000 ? 'Monitoreando' : 'Sin conexión',
      }
    }

    const newLabels = results.map((entry: SensorReading) =>
      new Date(entry.timestamp).toLocaleTimeString(),
    )
    const newTempData = results.map((entry: SensorReading) => entry.temperature)
    const newHumData = results.map((entry: SensorReading) => entry.humidity)

    chartData.value = {
      labels: newLabels,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: newTempData,
        },
        {
          ...chartData.value.datasets[1],
          data: newHumData,
        },
      ],
    }
  } catch (error) {
    console.error('Error fetching sensor data:', error)
    systemStatus.value = {
      isConnected: false,
      message: 'Sin conexión',
    }
  }
}

const fetchLastAlert = async () => {
  if (!sensorId.value) return
  try {
    const data = await sensorsService.getSensorAlerts(sensorId.value)
    if (data.results.length > 0) {
      lastAlert.value = data.results[0]
    }
  } catch (error) {
    console.error('Error fetching sensor alerts:', error)
  }
}

onMounted(() => {
  fetchSensorData()
  fetchSensorThresholds()
  fetchLastAlert()
  interval = window.setInterval(fetchSensorData, 3000)
})

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval)
  }
})
</script>

<template>
  <div class="h-[calc(100vh-80px)] p-4 overflow-hidden">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <!-- Left Section -->
      <div class="bg-[#1E1E1E] rounded-lg p-4 h-fit">
        <div class="flex flex-col gap-4 h-full">
          <div class="bg-gray-800 rounded-lg p-4">
            <h1 class="text-xl font-semibold text-white mb-2">Panel de Control</h1>
            <div class="flex items-center gap-2">
              <span
                class="w-2 h-2 rounded-full"
                :class="systemStatus.isConnected ? 'bg-green-500' : 'bg-gray-500'"
              ></span>
              <span class="text-sm text-gray-300">
                {{ systemStatus.isConnected ? 'Sistema activo' : 'Sistema inactivo' }}
              </span>
            </div>
          </div>

          <div class="flex-1 flex flex-col gap-4">
            <SystemStatusCard
              :is-connected="systemStatus.isConnected"
              :message="systemStatus.message"
              :last-update="lastMeasurementTime"
            />

            <OptimalRangesCard
              :temperature-range="temperatureRange"
              :humidity-range="humidityRange"
            />

            <LastAlertCard v-if="lastAlert" :alert="lastAlert" :alert-type="getAlertType" />
          </div>
        </div>
      </div>

      <!-- Right Section -->
      <div class="lg:col-span-2 bg-[#1E1E1E] rounded-lg p-4 h-full">
        <div class="flex flex-col gap-4 h-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricsCard type="temperature" :value="temperature" :range="temperatureRange" />
            <MetricsCard type="humidity" :value="humidity" :range="humidityRange" />
          </div>

          <div class="flex-1">
            <ChartSection :chart-data="chartData" :measurements-count="measurementsCount" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
