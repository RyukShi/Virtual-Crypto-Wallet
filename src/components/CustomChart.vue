<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart, { type ChartType, type ChartData } from 'chart.js/auto'

type CustomChartProps = {
  type: ChartType;
  data: ChartData;
  title?: string;
  showLegend?: boolean;
  scales?: any;
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
          display: Boolean(props.title),
          text: props.title,
          font: {
            size: 24,
            weight: 'normal'
          }
        },
        legend: {
          display: props.showLegend,
          position: 'right',
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: props.scales
    }
  })
})
</script>

<template>
  <div class="my-20 centered">
    <canvas ref="customChart" />
  </div>
</template>
