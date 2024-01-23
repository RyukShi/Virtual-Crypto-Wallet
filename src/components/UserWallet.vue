<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { formattedNumber } from '../utils'
import { useRouter } from 'vue-router'
import CustomChart from './CustomChart.vue'
import CubeLoader from './CubeLoader.vue'
import UserTransactions from './UserTransactions.vue'
import { useUserStore, type DigitalWallet, type Transaction } from '@/stores/user-store'
import { useAPIStore } from '@/stores/api-store'

const userStore = useUserStore()
const APIStore = useAPIStore()
const router = useRouter()

const { firstName, lastName } = userStore.user.user_metadata
const stars = '********'

const data = ref()
const transactions = ref<Transaction[]>([])
/* Boolean refs */
const loading = ref(false)
const privateMode = ref(false)
/* Number refs */
const walletBalance = ref(0)
/* TODO */
const profitLoss = ref(100.118)

const computeAssetsPrices = async (digitalWallet: DigitalWallet) => {
  var updatedAssets = await Promise.all(digitalWallet.map(digitalCurrency => APIStore.getAssetById(digitalCurrency.asset_id)))
  /* flat updatedAssets array */
  updatedAssets = updatedAssets.flat()

  const assetPrices = digitalWallet.map(digitalCurrency => {
    const foundAsset = updatedAssets.find(asset => asset?.asset_id === digitalCurrency.asset_id)
    if (foundAsset)
      return (digitalCurrency.balance * foundAsset.price_usd)
  })

  const sum = assetPrices.reduce((a, b) => {
    if (!!a && !!b) return a + b
  }, 0)

  return { sum, assetPrices }
}

onBeforeMount(async () => {
  const { transactions, digitalWallet } = userStore.user.user_metadata
  transactions.value = transactions
  try {
    loading.value = true

    const { sum, assetPrices } = await computeAssetsPrices(digitalWallet)

    walletBalance.value = sum ?? 0

    data.value = {
      labels: (digitalWallet as DigitalWallet).map(a => `${a.name} (${a.asset_id})`),
      datasets: [{
        data: assetPrices,
        backgroundColor: (digitalWallet as DigitalWallet).map(a => a.color),
        hoverOffset: 4
      }]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

/* Computed refs */
const formattedProfitLoss = computed(() => {
  if (!privateMode.value) return formattedNumber(profitLoss.value)
  else return stars
})

const formattedWalletBalance = computed(() => {
  if (!privateMode.value) return formattedNumber(walletBalance.value)
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
      <p class="text-xl">Glad to see you again {{ `${firstName} ${lastName}` }}</p>
      <p class="text-3xl font-semibold">{{ formattedWalletBalance }}</p>
      <p :class="`text-xl font-semibold ${getColor}`">{{ formattedProfitLoss }}</p>
      <button class="btn btn-sky" @click="privateMode = !privateMode">
        Private mode
      </button>
      <button class="btn btn-rose" @click="signOut">Sign out</button>
    </div>

    <CustomChart v-if="!privateMode && data" type="doughnut" :data="data" title="Allocation" />

    <UserTransactions :transactions="transactions" />
  </div>
</template>
