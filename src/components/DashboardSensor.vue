<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const temperatura = ref(0)
const humedad = ref(0)
const chartData = ref({
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
          size: 10
        }
      }
    },
    x: {
      ticks: {
        font: {
          size: 10
        },
        maxRotation: 0
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        boxWidth: 15,
        font: {
          size: 11
        }
      }
    }
  }
}

// Propiedades computadas para los estados
const getTemperaturaEstado = computed(() => {
  if (temperatura.value >= 18 && temperatura.value <= 28) {
    return 'optimo'
  } else if (temperatura.value < 15 || temperatura.value > 30) {
    return 'peligro'
  } else {
    return 'alerta'
  }
})

const getTemperaturaMessage = computed(() => {
  if (temperatura.value >= 18 && temperatura.value <= 28) {
    return 'Temperatura óptima'
  } else if (temperatura.value < 15) {
    return 'Temperatura demasiado baja'
  } else if (temperatura.value > 30) {
    return 'Temperatura demasiado alta'
  } else {
    return 'Temperatura en rango de alerta'
  }
})

const getHumedadEstado = computed(() => {
  if (humedad.value >= 30 && humedad.value <= 70) {
    return 'optimo'
  } else if (humedad.value < 20 || humedad.value > 80) {
    return 'peligro'
  } else {
    return 'alerta'
  }
})

const getHumedadMessage = computed(() => {
  if (humedad.value >= 30 && humedad.value <= 70) {
    return 'Humedad óptima'
  } else if (humedad.value < 20) {
    return 'Humedad demasiado baja'
  } else if (humedad.value > 80) {
    return 'Humedad demasiado alta'
  } else {
    return 'Humedad en rango de alerta'
  }
})

// Variable para almacenar la referencia al intervalo
let intervalo: number | null = null

// Simular datos en tiempo real (reemplazar con tu API real)
onMounted(() => {
  // Aquí deberías hacer la conexión con tu backend real
  intervalo = window.setInterval(() => {
    temperatura.value = Math.random() * 30 + 10
    humedad.value = Math.random() * 50 + 30

    // Crear copias de los arrays para evitar mutaciones reactivas en bucle
    const newLabels = [...chartData.value.labels]
    const newTempData = [...chartData.value.datasets[0].data]
    const newHumData = [...chartData.value.datasets[1].data]
    
    newLabels.push(new Date().toLocaleTimeString())
    newTempData.push(temperatura.value)
    newHumData.push(humedad.value)
    
    // Mantener solo los últimos 10 datos
    if (newLabels.length > 10) {
      newLabels.shift()
      newTempData.shift()
      newHumData.shift()
    }
    
    // Actualizar chartData de una sola vez
    chartData.value = {
      labels: newLabels,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: newTempData
        },
        {
          ...chartData.value.datasets[1],
          data: newHumData
        }
      ]
    }
  }, 3000)
})

// Limpiar el intervalo cuando el componente se desmonta
onUnmounted(() => {
  if (intervalo !== null) {
    clearInterval(intervalo)
  }
})
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-content">
      <div class="info-section">
        <div class="dashboard-header">
          <h1>Panel de Control</h1>
          <div class="status-indicator">
            <span class="dot active"></span>
            Sistema activo
          </div>
        </div>

        <div class="info-cards">
          <div class="info-card">
            <h3>Estado del Sistema</h3>
            <div class="card-content">
              <div class="status-item">
                <span class="label">Estado:</span>
                <span class="value">Monitoreando</span>
              </div>
              <div class="status-item">
                <span class="label">Última actualización:</span>
                <span class="value">{{ new Date().toLocaleTimeString() }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Rangos Óptimos</h3>
            <div class="card-content">
              <div class="range-item">
                <i class="fas fa-temperature-high"></i>
                <span class="label">Temperatura:</span>
                <span class="value">18°C - 28°C</span>
              </div>
              <div class="range-item">
                <i class="fas fa-tint"></i>
                <span class="label">Humedad:</span>
                <span class="value">30% - 70%</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>Información</h3>
            <div class="card-content">
              <p>
                Las mediciones se actualizan automáticamente cada 3 segundos para garantizar datos
                precisos en tiempo real.
              </p>
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
}

.dot.active {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
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
</style>
