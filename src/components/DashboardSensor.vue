<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    },
  },
}

// Simular datos en tiempo real (reemplazar con tu API real)
onMounted(() => {
  // Aquí deberías hacer la conexión con tu backend real
  setInterval(() => {
    temperatura.value = Math.random() * 30 + 10
    humedad.value = Math.random() * 50 + 30

    const tiempo = new Date().toLocaleTimeString()
    chartData.value.labels.push(tiempo)
    chartData.value.datasets[0].data.push(temperatura.value)
    chartData.value.datasets[1].data.push(humedad.value)

    // Mantener solo los últimos 10 datos
    if (chartData.value.labels.length > 10) {
      chartData.value.labels.shift()
      chartData.value.datasets[0].data.shift()
      chartData.value.datasets[1].data.shift()
    }
  }, 3000)
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
          <h2>Historial de Mediciones</h2>
          <p class="grafico-descripcion">Últimas 10 mediciones registradas</p>
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
  padding: 20px;
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
  margin-bottom: 30px;
  padding: 15px;
  background: #1a1a1a;
  border-radius: 10px;
}

.dashboard-header h1 {
  font-size: 2rem;
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
  gap: 20px;
}

.info-card {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 20px;
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
  gap: 20px;
  padding: 20px;
  background: var(--color-background-soft);
  border-radius: 15px;
}

.mediciones-actuales {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.medicion {
  padding: 20px;
  border-radius: 12px;
  background: var(--color-background);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.grafico-container {
  flex-grow: 1;
  background: var(--color-background);
  padding: 20px;
  border-radius: 12px;
  min-height: 400px;
}

.valor {
  font-size: 3rem;
  font-weight: bold;
  margin-top: 10px;
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
  height: 400px;
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
</style>
