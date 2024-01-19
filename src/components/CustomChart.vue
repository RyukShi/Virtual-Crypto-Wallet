<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart, { type ChartType, type ChartData } from 'chart.js/auto'

export type CustomChartProps = {
  type: ChartType;
  data: ChartData;
  title: string;
}

const props = defineProps<CustomChartProps>()

const customChart = ref<HTMLCanvasElement>()

onMounted(() => {
  const ctx = customChart.value?.getContext('2d')
  if (!ctx) return
  new Chart(ctx, {
    type: props.type,
    data: props.data,
    options: {
      plugins: {
        title: {
          display: true,
          text: props.title,
          color: '#f8fafc',
          font: {
            size: 26,
            weight: 'normal',
            family: 'JetBrains Mono, monospace'
          }
        },
        legend: {
          position: 'right',
          labels: {
            color: '#f8fafc',
            font: {
              size: 16,
              family: 'JetBrains Mono, monospace'
            }
          }
        }
      }
    }
  })
})
</script>

<template>
  <div class="my-20 max-w-2xl">
    <canvas ref="customChart" />
  </div>
</template>
