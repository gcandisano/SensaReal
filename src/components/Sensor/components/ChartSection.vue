<script setup lang="ts">
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

const props = defineProps<{
  chartData: {
    labels: string[]
    datasets: { label: string; data: number[]; borderColor: string; tension: number }[]
  }
  measurementsCount: number
}>()

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
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-4 shadow-lg h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-white">Historial de Mediciones</h2>
      <p class="text-sm text-gray-400">Últimas {{ measurementsCount }} mediciones</p>
    </div>
    <div class="flex-1">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
