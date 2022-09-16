<script setup>
import { useAPIStore } from '../stores/api-store'
import { ref, computed } from 'vue'

const APIStore = useAPIStore()

const cryptoNameInput = ref('')

const getFilteredCrypto = computed(() => {
  // filtering crypto assets for faster rendering
  return APIStore.assets.filter(asset =>
    asset.type_is_crypto === 1 &&
    !isNaN(asset.price_usd) &&
    asset.volume_1day_usd > 10000000 &&
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
    <input class="mt-2" type="text" v-model="cryptoNameInput" placeholder="Asset ID or Name">
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
        <tr v-for="(crypto, i) in getFilteredCrypto" :key="crypto.asset_id">
          <td>{{ i }}</td>
          <td><strong>{{ crypto.name }}</strong> ({{ crypto.asset_id }})</td>
          <td>$ {{ roundNumber(crypto.price_usd, 5) }}</td>
          <td>$ {{ crypto.volume_1day_usd }}</td>
          <td><router-link class="text-white p-2 text-center rounded-md"
          :to="{ name: 'crypto-details', params: { cryptoId: crypto.asset_id } }"
          role="button">View</router-link></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>