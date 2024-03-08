<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { formattedNumber } from '../utils'
import { useAPIStore, type Asset } from '@/stores/api-store'
import { useRoute, useRouter } from 'vue-router'
import CubeLoader from '@/components/CubeLoader.vue'
import CustomChart from '@/components/CustomChart.vue'
import type { ChartData } from 'chart.js';

const APIStore = useAPIStore()
const route = useRoute()
const router = useRouter()

const asset = ref<Asset>()
const data = ref<ChartData>()

onBeforeMount(async () => {
  const { assetId } = route.params
  const a = await APIStore.getAssetById(assetId as string)
  if (a) asset.value = a
  else {
    router.push({ name: 'marketplace' })
    return
  }

  data.value = {
    labels: ['Hour', 'Day', 'Month'],
    datasets: [{
      data: [a.volume_1hrs_usd, a.volume_1day_usd, a.volume_1mth_usd],
      backgroundColor: ['#F9AB41', '#418CF9', '#F9418F']
    }]
  }
})
</script>

<template>
  <div v-if="APIStore.loading" class="centered my-20">
    <CubeLoader />
  </div>
  <div v-else-if="asset">
    <h2 class="sub-title">* {{ asset.name }} ({{ asset.asset_id }}) *</h2>
    <span>Current price : {{ formattedNumber(asset.price_usd) }}</span>

    <CustomChart v-if="data" type="bar" :data="data" :scales="{ y: { type: 'logarithmic' } }" />

    <RouterLink class="btn btn-sky"
      :to="{ name: 'swapping', query: { assetId: asset.asset_id, assetType: asset.type_is_crypto.toString() } }">
      Buy / Swap
    </RouterLink>
  </div>
  <div v-else>
    <h2 class="sub-title">No asset found.</h2>
  </div>
</template>
