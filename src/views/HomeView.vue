<script setup>
import { useAPIStore } from '../stores/api-store'
import { onBeforeMount } from 'vue';

const APIStore = useAPIStore()

onBeforeMount(() => {
  // if data are not loaded from API, load them
  if (APIStore.assets.length === 0) {
    APIStore.getAssetsFromAPI()
  }
  if (APIStore.exchanges.length === 0) {
    APIStore.getExchangesFromAPI()
  }
})
</script>

<template>
  <h1>Home</h1>
  <div class="marketplace mt-32 h-full">
    <div class="flex justify-evenly">

      <div class="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <router-link to="/crypto">
          <img class="rounded-t-lg w-72 h-44" src="@/assets/images/btc-eth.png" alt="Bitcoin and Ethereum" />
        </router-link>
        <div class="p-5">
          <router-link to="/crypto">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Crypto Marketplace</h5>
          </router-link>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">View the different crypto assets statistics, price and volume.</p>
        </div>
      </div>

      <div class="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <router-link to="/fiat">
          <img class="rounded-t-lg w-72 h-44" src="@/assets/images/euro-dollar.jpg" alt="Euro and Dollar" />
        </router-link>
        <div class="p-5">
          <router-link to="/fiat">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Fiat Marketplace</h5>
          </router-link>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">View the different fiat money statistics, price and volume.</p>
        </div>
      </div>

    </div>
  </div>
</template>
