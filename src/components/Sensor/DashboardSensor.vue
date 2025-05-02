<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { sensorsService } from '@/services/api/sensors'
import type { SensorThreshold, SensorAlert } from '@/types/sensors'
import { useRoute } from 'vue-router'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps<{ sensorId: string }>()

const temperatura = ref(0)
const humedad = ref(0)
let intervalo: number | null = null

const chartData = ref<{
  labels: string[]
  datasets: { label: string; data: number[]; borderColor: string; tension: number }[]
}>({
  labels: [],
  datasets: [
    {
      label: 'Temperatura (°C)',
      data: [0.5, 0.2, 0.7],
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    x: {
      ticks: {
        font: {
          size: 10,
        },
        maxRotation: 0,
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        boxWidth: 15,
        font: {
          size: 11,
        },
      },
    },
  },
}

const temperatureRange = ref({ min: 0, max: 0 })
const humidityRange = ref({ min: 0, max: 0 })

const lastAlert = ref<SensorAlert | null>(null)
const temperatureThresholds = ref<SensorThreshold[]>([])
const humidityThresholds = ref<SensorThreshold[]>([])

const getAlertType = computed(() => {
  if (!lastAlert.value) return null
  
  // Buscar en los thresholds de temperatura
  const tempThreshold = temperatureThresholds.value.find(
    (t: SensorThreshold) => t.threshold === lastAlert.value?.thresholdValue
  )
  
  // Si coincide con un threshold de temperatura, es una alerta de temperatura
  if (tempThreshold) return 'temperature'
  
  // Si no coincide con temperatura, debe ser humedad
  return 'humidity'
})

const fetchSensorThresholds = async () => {
  if (!sensorId.value) return
  try {
    const thresholds = await sensorsService.getSensorThresholds(sensorId.value)

    // Filtrar thresholds por tipo
    temperatureThresholds.value = thresholds.filter((t) => t.type === 'temperature' && t.isActive)
    humidityThresholds.value = thresholds.filter((t) => t.type === 'humidity' && t.isActive)

    // Actualizar rangos de temperatura
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

    // Actualizar rangos de humedad
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

// Propiedades computadas para los estados
const getTemperaturaEstado = computed(() => {
  if (
    temperatura.value >= temperatureRange.value.min &&
    temperatura.value <= temperatureRange.value.max
  ) {
    return 'optimo'
  } else if (
    temperatura.value < temperatureRange.value.min - 3 ||
    temperatura.value > temperatureRange.value.max + 2
  ) {
    return 'peligro'
  } else {
    return 'alerta'
  }
})

const getTemperaturaMessage = computed(() => {
  if (
    temperatura.value >= temperatureRange.value.min &&
    temperatura.value <= temperatureRange.value.max
  ) {
    return 'Temperatura óptima'
  } else if (temperatura.value < temperatureRange.value.min) {
    return 'Temperatura demasiado baja'
  } else if (temperatura.value > temperatureRange.value.max) {
    return 'Temperatura demasiado alta'
  } else {
    return 'Temperatura en rango de alerta'
  }
})

const getHumedadEstado = computed(() => {
  if (humedad.value >= humidityRange.value.min && humedad.value <= humidityRange.value.max) {
    return 'optimo'
  } else if (
    humedad.value < humidityRange.value.min - 10 ||
    humedad.value > humidityRange.value.max + 10
  ) {
    return 'peligro'
  } else {
    return 'alerta'
  }
})

const getHumedadMessage = computed(() => {
  if (humedad.value >= humidityRange.value.min && humedad.value <= humidityRange.value.max) {
    return 'Humedad óptima'
  } else if (humedad.value < humidityRange.value.min) {
    return 'Humedad demasiado baja'
  } else if (humedad.value > humidityRange.value.max) {
    return 'Humedad demasiado alta'
  } else {
    return 'Humedad en rango de alerta'
  }
})

const route = useRoute()
const sensorId = ref(route.params.id as string) // Extrae el sensorId de la ruta

// Define el tipo para los resultados del sensor
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

// Agregar variable para la última medición
const lastMeasurementTime = ref('')

// Agregar variable para el estado del sistema
const systemStatus = ref({
  isConnected: false,
  message: 'Sin conexión'
})

const fetchSensorData = async () => {
  if (!sensorId.value) return
  try {
    const data = await sensorsService.getSensorData(sensorId.value)
    const results: SensorReading[] = data.results

    // Ordenar los resultados por timestamp de menor a mayor
    results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Actualizar las variables con los datos más recientes
    if (results.length > 0) {
      const latestReading = results[results.length - 1]
      temperatura.value = latestReading.temperature
      humedad.value = latestReading.humidity
      lastMeasurementTime.value = new Date(latestReading.timestamp).toLocaleTimeString()
      
      // Verificar si la última medición fue hace menos de 1 minuto
      const lastReadingTime = new Date(latestReading.timestamp).getTime()
      const currentTime = new Date().getTime()
      const timeDiff = currentTime - lastReadingTime
      
      systemStatus.value = {
        isConnected: timeDiff < 60000, // 60000 ms = 1 minuto
        message: timeDiff < 60000 ? 'Monitoreando' : 'Sin conexión'
      }
    }

    // Actualizar el historial de mediciones
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
      message: 'Sin conexión'
    }
  }
}

const fetchLastAlert = async () => {
  if (!sensorId.value) return
  try {
    const data = await sensorsService.getSensorAlerts(sensorId.value)
    if (data.results.length > 0) {
      lastAlert.value = data.results[0] // La primera alerta es la más reciente
    }
  } catch (error) {
    console.error('Error fetching sensor alerts:', error)
  }
}

onMounted(() => {
  fetchSensorData()
  fetchSensorThresholds()
  fetchLastAlert()
  intervalo = window.setInterval(fetchSensorData, 3000)
})

onUnmounted(() => {
  if (intervalo !== null) {
    clearInterval(intervalo)
  }
})

const mostrarModal = ref(false)
const nuevoSensorId = ref('')

function abrirModal() {
  mostrarModal.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

function agregarSensor() {
  console.log('ID del nuevo sensor:', nuevoSensorId.value)
  cerrarModal()
}

</script>

<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="info-section">
        <div class="dashboard-header">
          <h1>Panel de Control</h1>
          <div class="status-indicator">
            <span class="dot" :class="{ active: systemStatus.isConnected }"></span>
            {{ systemStatus.isConnected ? 'Sistema activo' : 'Sistema inactivo' }}
          </div>
        </div>

        <div v-if="mostrarModal" class="modal-overlay">
          <div class="modal">
            <h2>Agregar Sensor</h2>
            <label for="sensor-id">ID del Sensor:</label>
            <input type="text" id="sensor-id" v-model="nuevoSensorId" />
            <button @click="agregarSensor">Agregar</button>
            <button @click="cerrarModal">Cancelar</button>
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <h3>Estado del Sistema</h3>
            <div class="card-content">
              <div class="status-item">
                <span class="label">Estado:</span>
                <span class="value" :class="{ 'text-red-500': !systemStatus.isConnected, 'text-green-500': systemStatus.isConnected }">
                  {{ systemStatus.message }}
                </span>
              </div>
              <div class="status-item">
                <span class="label">Última actualización:</span>
                <span class="value">{{ lastMeasurementTime }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Rangos Óptimos</h3>
            <div class="card-content">
              <div class="range-item">
                <i class="fas fa-temperature-high"></i>
                <span class="label">Temperatura:</span>
                <span class="value"
                  >{{ temperatureRange.min }}°C - {{ temperatureRange.max }}°C</span
                >
              </div>
              <div class="range-item">
                <i class="fas fa-tint"></i>
                <span class="label">Humedad:</span>
                <span class="value">{{ humidityRange.min }}% - {{ humidityRange.max }}%</span>
              </div>
            </div>
          </div>

      

          <div class="info-card" v-if="lastAlert">
            <h3>Última Alerta</h3>
            <div class="card-content">
              <div class="alert-info">
                <div class="status-item">
                  <span class="label">Tipo:</span>
                  <span class="value">{{ getAlertType === 'temperature' ? 'Temperatura' : 'Humedad' }}</span>
                </div>
                <div class="status-item">
                  <span class="label">Valor registrado:</span>
                  <span class="value">{{ lastAlert.actualValue }}{{ getAlertType === 'temperature' ? '°C' : '%' }}</span>
                </div>
                <div class="status-item">
                  <span class="label">Valor límite:</span>
                  <span class="value">{{ lastAlert.thresholdValue }}{{ getAlertType === 'temperature' ? '°C' : '%' }}</span>
                </div>
                <div class="status-item">
                  <span class="label">Fecha:</span>
                  <span class="value">{{ new Date(lastAlert.sentAt).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="metrics-section">
        <div class="mediciones-actuales">
          <div class="medicion temperatura">
            <h2>Temperatura</h2>
            <div class="valor">{{ temperatura.toFixed(1) }}°C</div>
            <p class="descripcion">Temperatura ambiente actual</p>
            <div class="estado" :class="getTemperaturaEstado">
              {{ getTemperaturaMessage }}
            </div>
          </div>
          <div class="medicion humedad">
            <h2>Humedad</h2>
            <div class="valor">{{ humedad.toFixed(1) }}%</div>
            <p class="descripcion">Humedad relativa del aire</p>
            <div class="estado" :class="getHumedadEstado">
              {{ getHumedadMessage }}
            </div>
          </div>
        </div>

        <div class="grafico-container">
          <div class="grafico-header">
            <h2>Historial de Mediciones</h2>
            <p class="grafico-descripcion">Últimas 10 mediciones</p>
          </div>
          <div class="grafico">
            <Line :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  height: calc(100vh - 80px);
  padding: 15px;
  overflow: hidden;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  height: 100%;
}

.info-section {
  padding: 20px;
  background: var(--color-background-soft);
  border-radius: 15px;
  height: 100%;
}

.info-section-wrapper {
  background: var(--color-background);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
}

.dashboard-header {
  margin-bottom: 15px;
  padding: 10px;
  background: #1a1a1a;
  border-radius: 10px;
}

.dashboard-header h1 {
  font-size: 1.6rem;
  color: var(--color-heading);
  margin: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--color-text);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  transition: all 0.3s ease;
}

.dot.active {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-card {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  background: #1a1a1a;
  border-radius: 10px;
}

.info-card h3 {
  color: var(--color-heading);
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.card-content {
  color: var(--color-text);
}

.card-content.compact {
  display: flex;
  flex-wrap: wrap;
}

.ml-auto {
  margin-left: auto;
}

.compact-text {
  font-size: 0.9rem;
  margin: 0;
}

.status-item,
.range-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.label {
  color: var(--color-text);
  opacity: 0.8;
}

.value {
  font-weight: 500;
  color: var(--color-heading);
}

.range-item i {
  width: 20px;
  color: var(--color-heading);
}

.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  background: var(--color-background-soft);
  border-radius: 15px;
}

.mediciones-actuales {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.medicion {
  padding: 15px;
  border-radius: 12px;
  background: var(--color-background);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.grafico-container {
  flex-grow: 1;
  background: var(--color-background);
  padding: 20px;
  border-radius: 12px;
  min-height: 300px;
}

.valor {
  font-size: 2.5rem;
  font-weight: bold;
  margin-top: 5px;
}

.temperatura .valor {
  color: #ff6384;
}

.humedad .valor {
  color: #36a2eb;
}

.descripcion {
  margin-top: 10px;
  color: var(--color-text);
}

.estado {
  margin-top: 10px;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.temperatura .estado {
  background-color: #ff6384;
  color: white;
}

.humedad .estado {
  background-color: #36a2eb;
  color: white;
}

.temperatura .estado.optimo {
  background-color: #4caf50;
}

.humedad .estado.optimo {
  background-color: #4caf50;
}

.temperatura .estado.alerta {
  background-color: #ff4500;
}

.humedad .estado.alerta {
  background-color: #ff4500;
}

.temperatura .estado.peligro {
  background-color: #ff0000;
}

.humedad .estado.peligro {
  background-color: #ff0000;
}

.grafico {
  height: 300px;
  margin-top: 20px;
}

.info-card.dark {
  background: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.info-card.dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.grafico-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.grafico-descripcion {
  font-size: 0.8rem;
  opacity: 0.8;
  margin: 0;
}

@media (max-height: 800px) {
  .dashboard-content {
    gap: 15px;
  }

  .info-card h3 {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .grafico {
    height: 250px;
  }

  .grafico-container {
    min-height: 250px;
  }

  .valor {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.2rem;
  }
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
  background-color: #1a1a1a;
}

.add-sensor-button {
  margin-right: 10px;
}

.user-icon {
  /* Estilos para el icono de usuario */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin-top: 0;
}

.modal label {
  display: block;
  margin-bottom: 5px;
}

.modal input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.modal button:hover {
  background-color: #45a049;
}

.modal button:last-child {
  background-color: #f44336;
}

.modal button:last-child:hover {
  background-color: #e53935;
}

.text-red-500 {
  color: #ef4444;
}

.text-green-500 {
  color: #22c55e;
}
</style>
