<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import CustomTable from './CustomTable.vue'
import CubeLoader from './CubeLoader.vue'
import { useAPIStore, type Asset } from '@/stores/api-store'
import { formattedNumber, formattedDate } from '../utils'

const APIStore = useAPIStore()

onBeforeMount(() => APIStore.getAssetsFromAPI())

const TYPE_OPTIONS = [
  { type: -1, label: 'All' },
  { type: 1, label: 'Crypto' },
  { type: 0, label: 'Fiat' }
]

const columns = [
  {
    name: 'asset-symbol', label: 'Symbol', align: 'left',
    field: (row: Asset) => `${row.name} (${row.asset_id})`
  },
  {
    name: 'asset-price', label: 'Price', align: 'left', field: 'price_usd',
    format: (value: number) => formattedNumber(value)
  },
  {
    name: 'asset-day-volume', label: 'Day Volume', align: 'left', field: 'volume_1day_usd',
    format: (value: number) => formattedNumber(value)
  },
]
/* refs */
const assetInput = ref('')
const selectedType = ref(TYPE_OPTIONS[1])

const getFilteredAssets = computed(() => {
  return APIStore.getFilteredAssets.filter(asset =>
    (selectedType.value?.type === -1 || selectedType.value?.type === asset.type_is_crypto) &&
    ((assetInput.value === '') || (asset.name.toLowerCase().includes(assetInput.value.toLowerCase()) ||
      asset.asset_id.toLowerCase() === assetInput.value.toLowerCase()))
  )
})
</script>

<template>
  <div v-if="!APIStore.loading" class="my-20">
    <div class="centered gap-x-4 mb-20">
      <q-select v-model="selectedType" outlined transition-show="flip-up" transition-hide="flip-down"
        :options="TYPE_OPTIONS" label="Asset type" style="width: 200px;">
      </q-select>
      <q-input type="text" v-model="assetInput" outlined label="Asset ID or Name" />
    </div>
    <span v-if="APIStore.lastUpdate">
      Last update at {{ formattedDate(APIStore.lastUpdate) }}
    </span>
    <CustomTable :columns="columns" :rows="getFilteredAssets" />
  </div>
  <div v-else class="centered my-20">
    <CubeLoader />
  </div>
</template>
