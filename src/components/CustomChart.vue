<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  }
})

const customChart = ref(null)

onMounted(() => {
  const ctx = customChart.value.getContext('2d')
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
