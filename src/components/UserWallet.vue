<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue'
import { formatedNumber } from '../utils'
import { useRouter } from 'vue-router'
import CustomChart from './CustomChart.vue'
import CubeLoader from './CubeLoader.vue'

const userStore = inject('userStore')
const APIStore = inject('APIStore')
const router = useRouter()

/* Extract data from userStore */
const { digitalWallet, initialBalance,
        firstName, lastName } = userStore.user.user_metadata
const stars = '********'

const data = ref(null)
/* Boolean refs */
const loading = ref(false)
const privateMode = ref(false)
/* Number refs */
const walletBalance = ref(0)
const Accountbalance = ref(initialBalance)
const profitLoss = ref(100.118)

onBeforeMount(async () => {
  if (digitalWallet) {
    try {
      loading.value = true
      var userAssets = await Promise.all(digitalWallet.map(a => APIStore.getAssetById(a.asset_id)))
      /* flat userAssets array */
      userAssets = userAssets.flat()
      const AssetPrices = digitalWallet.map(a => a.balance * userAssets.find(asset => asset.asset_id === a.asset_id).price_usd)
      /* Sum all asset prices */
      walletBalance.value = AssetPrices.reduce((a, b) => a + b, 0)

      data.value = {
        labels: digitalWallet.map(a => `${a.name} (${a.asset_id})`),
        datasets: [{
          data: AssetPrices,
          backgroundColor: digitalWallet.map(a => a.color),
          hoverOffset: 4
        }]
      }
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
})

/* Computed refs */
const fullName = computed(() => {
  return `${firstName} ${lastName}`
})

const formatedAccountBalance = computed(() => {
  if (!privateMode.value) return formatedNumber(Accountbalance.value)
  else return stars
})

const formatedProfitLoss = computed(() => {
  if (!privateMode.value) return formatedNumber(profitLoss.value)
  else return stars
})

const formatedWalletBalance = computed(() => {
  if (!privateMode.value) return formatedNumber(walletBalance.value)
  else return stars
})

const getColor = computed(() => {
  if (privateMode.value) return 'text-slate-50'
  else {
    if (profitLoss.value >= 0) return 'text-lime-500'
    else return 'text-rose-500'
  }
})

const signOut = async () => {
  await userStore.logout()
  router.push({ name: 'marketplace' })
}
</script>

<template>
  <div class="my-20">
    <div v-if="loading" class="centered">
      <CubeLoader />
    </div>
    <div v-else class="flex flex-col gap-y-5 items-center">
      <p class="text-xl">Glad to see you again {{ fullName }}</p>
      <p class="text-3xl font-semibold">{{ formatedAccountBalance }}</p>
      <p class="text-3xl font-semibold">{{ formatedWalletBalance }}</p>
      <p :class="`text-xl font-semibold ${getColor}`">{{ formatedProfitLoss }}</p>
      <button class="btn btn-sky" @click="privateMode = !privateMode">
        Private mode
      </button>
      <button class="btn btn-rose" @click="signOut">Sign out</button>
    </div>

    <CustomChart v-if="!privateMode && data" type="doughnut" :data="data"
      title="Allocation" />
  </div>
</template>
