<script setup>
import { ref, computed } from 'vue'
import { useAPIStore } from '../stores/api-store'

const APIStore = useAPIStore()

const fiatNameInput = ref('')

const getFilteredFiat = computed(() => {
  // filtering fiat assets for faster rendering
  return APIStore.assets.filter(asset =>
    asset.type_is_crypto === 0 &&
    !isNaN(asset.price_usd) &&
    asset.volume_1day_usd > 100000 &&
    asset.price_usd > 0
  )
})

const roundNumber = (number, decimals) => {
  if (decimals === undefined) decimals = 3
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

</script>

<template>
  <div class="">
    <h4 class="mt-4">Filters</h4>
    <input class="mt-2" type="text" v-model="fiatNameInput" placeholder="Asset ID or Name">
    <table class="mt-4 w-80">
      <thead class="">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Day Volume</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody class="">
        <tr v-for="(fiat, i) in getFilteredFiat" :key="fiat.asset_id">
          <td>{{ i }}</td>
          <td><strong>{{ fiat.name }}</strong> ({{ fiat.asset_id }})</td>
          <td>$ {{ roundNumber(fiat.price_usd, 5) }}</td>
          <td>$ {{ fiat.volume_1day_usd }}</td>
          <td><router-link class="text-white p-2 text-center rounded-md"
          :to="{ name: 'fiat-details', params: { fiatId: fiat.asset_id } }"
          role="button">View</router-link></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>