<script setup>
import { useAPIStore } from '../stores/api-store'

const APIStore = useAPIStore()
const asset = APIStore.selectedAsset
</script>

<template>
  <div v-if="asset">
    <h2>{{ asset.name }} ({{ asset.asset_id }})</h2>
    <p>Current price : $ {{ asset.price_usd }}</p>
    <p>Volume 1 hour : $ {{ asset.volume_1hrs_usd }}</p>
    <p>Volume 1 day : $ {{ asset.volume_1day_usd }}</p>
    <p>Volume 1 month : $ {{ asset.volume_1mth_usd }}</p>
  </div>
</template>
