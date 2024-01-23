<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { formattedNumber } from '../utils'
import { useAPIStore, type Asset } from '@/stores/api-store'
import { useRoute } from 'vue-router'
import CubeLoader from '@/components/CubeLoader.vue'

const APIStore = useAPIStore()
const route = useRoute()

const asset = ref<Asset>()

onBeforeMount(async () => {
  const { assetId } = route.params
  const a = await APIStore.getAssetById(assetId as string)
  if (a) asset.value = a
})
</script>

<template>
  <div v-if="APIStore.loading" class="centered my-20">
    <CubeLoader />
  </div>
  <div v-else-if="asset">
    <h2 class="sub-title">* {{ asset.name }} ({{ asset.asset_id }}) *</h2>
    <p>Current price : {{ formattedNumber(asset.price_usd) }}</p>
    <p>Volume 1 hour : {{ formattedNumber(asset.volume_1hrs_usd) }}</p>
    <p>Volume 1 day : {{ formattedNumber(asset.volume_1day_usd) }}</p>
    <p>Volume 1 month : {{ formattedNumber(asset.volume_1mth_usd) }}</p>

    <RouterLink
      class="btn btn-sky"
      :to="{ name: 'swapping', query: { assetId: asset.asset_id, assetType: asset.type_is_crypto.toString() } }">
      Buy / Swap
    </RouterLink>
  </div>
  <div v-else>
    <h2 class="sub-title">No asset found.</h2>
  </div>
</template>
