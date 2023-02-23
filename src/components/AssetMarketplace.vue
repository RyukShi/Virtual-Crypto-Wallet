<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { useAPIStore } from '../stores/api-store'
import CustomTable from './CustomTable.vue'
import CubeLoader from './CubeLoader.vue'

const APIStore = useAPIStore()

onBeforeMount(() => APIStore.getAssetsFromAPI())

const TYPE_OPTIONS = [
  { value: 'all', label: 'All'},
  { value: 'crypto', label: 'Crypto' },
  { value: 'fiat', label: 'Fiat' }
]
const columns = ['#', 'Name', 'Price', 'Day Volume', 'Details']
/* refs */
const assetInput = ref(null)
const selectedType = ref('crypto')
/* computed refs */
const isCrypto = computed(() => selectedType.value === 'crypto')

const getFilteredAsset = computed(() => {
  // filtering assets for faster rendering
  return APIStore.assets.filter(asset =>
    (selectedType.value === 'all' || isCrypto.value === !!asset.type_is_crypto) &&
    !isNaN(asset.price_usd) && asset.price_usd > 0 &&
    asset.volume_1day_usd > Math.pow(10, 7)
  )
})
</script>

<template>
  <div v-if="!APIStore.loading" class="my-20">
    <h2 class="sub-title text-center">* Filters *</h2>
    <div class="centered gap-x-4 mb-20">
      <select v-model="selectedType">
        <option v-for="t in TYPE_OPTIONS" :key="t.value" :value="t.value">
          {{ t.label }}
        </option>
      </select>
      <input type="text" v-model="assetInput" placeholder="Asset ID or Name" />
    </div>
    <CustomTable :columns="columns" :assets="getFilteredAsset" />
  </div>
  <div v-else class="centered my-20">
    <CubeLoader />
  </div>
</template>
