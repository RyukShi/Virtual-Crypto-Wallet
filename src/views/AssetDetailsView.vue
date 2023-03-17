<script setup>
import { formatedNumber } from '../utils'
import { inject } from 'vue'

const APIStore = inject('APIStore')
const asset = APIStore.selectedAsset
</script>

<template>
  <div>
    <h2 class="sub-title">* {{ asset.name }} ({{ asset.asset_id }}) *</h2>
    <p>Current price : {{ formatedNumber(asset.price_usd) }}</p>
    <p>Volume 1 hour : {{ formatedNumber(asset.volume_1hrs_usd) }}</p>
    <p>Volume 1 day : {{ formatedNumber(asset.volume_1day_usd) }}</p>
    <p>Volume 1 month : {{ formatedNumber(asset.volume_1mth_usd) }}</p>

    <RouterLink
      class="btn btn-sky"
      :to="{ name: 'swapping', query: { isCrypto: asset.type_is_crypto, assetId: asset.asset_id } }">
      Buy / Swap
    </RouterLink>
  </div>
</template>
