<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import CustomTable from './CustomTable.vue'
import CubeLoader from './CubeLoader.vue'
import { useAPIStore } from '@/stores/api-store'

const APIStore = useAPIStore()

onBeforeMount(() => APIStore.getAssetsFromAPI())

const TYPE_OPTIONS = [
  { type: -1, label: 'All' },
  { type: 1, label: 'Crypto' },
  { type: 0, label: 'Fiat' }
]
const columns = ['#', 'Symbol', 'Price', 'Day Volume', 'Details']
/* refs */
const assetInput = ref('')
const selectedType = ref(TYPE_OPTIONS[1])

const getFilteredAsset = computed(() => {
  // filtering assets for faster rendering
  return APIStore.assets.filter(asset =>
    (selectedType.value?.type === -1 || selectedType.value?.type === asset.type_is_crypto) &&
    !isNaN(asset.price_usd) && asset.price_usd > 0 &&
    asset.volume_1day_usd > Math.pow(10, 7) &&
    ((assetInput.value === '') || (asset.name.toLowerCase().includes(assetInput.value.toLowerCase()) ||
      asset.asset_id.toLowerCase() === assetInput.value.toLowerCase()))
  ).map(asset => {
    const icon = APIStore.assetIcons.find(icon => icon.asset_id === asset.asset_id)
    /* Add iconUrl property into object */
    return { ...asset, iconUrl: (icon) ? icon.url : null }
  })
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
    <CustomTable :columns="columns" :assets="getFilteredAsset" />
  </div>
  <div v-else class="centered my-20">
    <CubeLoader />
  </div>
</template>
