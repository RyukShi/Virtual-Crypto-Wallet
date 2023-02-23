<script setup>
import { useAPIStore } from '../stores/api-store'
import { formatedNumber } from '../utils'

const APIStore = useAPIStore()
const asset = APIStore.selectedAsset
</script>

<template>
  <div v-if="asset">
    <h2 class="sub-title">* {{ asset.name }} ({{ asset.asset_id }}) *</h2>
    <p>Current price : {{ formatedNumber(asset.price_usd) }}</p>
    <p>Volume 1 hour : {{ formatedNumber(asset.volume_1hrs_usd) }}</p>
    <p>Volume 1 day : {{ formatedNumber(asset.volume_1day_usd) }}</p>
    <p>Volume 1 month : {{ formatedNumber(asset.volume_1mth_usd) }}</p>
  </div>
</template>
