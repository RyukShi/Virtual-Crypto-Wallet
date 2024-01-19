<script setup lang="ts">
import { ref, computed, onBeforeMount, inject } from 'vue'
import CustomTable from './CustomTable.vue'
import CubeLoader from './CubeLoader.vue'

const APIStore = inject('APIStore')

onBeforeMount(async () => await APIStore.getAssetsFromAPI())

const TYPE_OPTIONS = [
  { value: 'all', label: 'All'},
  { value: 1, label: 'Crypto' },
  { value: 0, label: 'Fiat' }
]
const columns = ['#', 'Symbol', 'Price', 'Day Volume', 'Details']
/* refs */
const assetInput = ref()
const selectedType = ref(1)

const getFilteredAsset = computed(() => {
  // filtering assets for faster rendering
  return APIStore.assets.filter(asset =>
    (selectedType.value === 'all' || selectedType.value === asset.type_is_crypto) &&
    !isNaN(asset.price_usd) && asset.price_usd > 0 &&
    asset.volume_1day_usd > Math.pow(10, 7) &&
    ((assetInput.value === null) || (asset.name.toLowerCase().includes(assetInput.value.toLowerCase()) ||
    asset.asset_id.toLowerCase() === assetInput.value.toLowerCase()))
  ).map(asset => {
    const icon = APIStore.assetIcons.find(icon => icon.asset_id === asset.asset_id)
    /* Add iconUrl property into object */
    return { ...asset, iconUrl: icon ? icon.url : null }
  })
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
