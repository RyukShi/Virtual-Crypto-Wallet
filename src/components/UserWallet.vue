<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { formattedNumber } from '../utils'
import { useRouter } from 'vue-router'
import CustomChart from './CustomChart.vue'
import CubeLoader from './CubeLoader.vue'
import UserTransactions from './UserTransactions.vue'
import { useUserStore, type DigitalWallet, type Transaction } from '@/stores/user-store'
import { useAPIStore } from '@/stores/api-store'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const APIStore = useAPIStore()
const router = useRouter()
const $q = useQuasar()

const stars = '********'

const data = ref()
const userTransactions = ref<Transaction[]>([])
const fullName = ref()
/* Boolean refs */
const loading = ref(false)
const privateMode = ref(false)
/* Number refs */
const walletBalance = ref(0)
/* TODO */
const profitLoss = ref(100.118)

const computeAssetsPrices = async (digitalWallet: DigitalWallet) => {
  const updatedAssets = await Promise.all(digitalWallet.map(digitalCurrency => APIStore.getAssetById(digitalCurrency.asset_id)))
  console.log(updatedAssets)

  const assetPrices = digitalWallet.map(digitalCurrency => {
    const foundAsset = updatedAssets.find(asset => asset?.asset_id === digitalCurrency.asset_id)
    if (foundAsset)
      return (digitalCurrency.balance * foundAsset.price_usd)
  })

  const sum = assetPrices.reduce((a, b) => {
    if (!!a && !!b) return a + b
  })

  return { sum, assetPrices }
}

onBeforeMount(async () => {
  if (!userStore.user) {
    router.push({ name: 'marketplace' })
    return
  }
  const { firstName, lastName, transactions, digitalWallet } = userStore.user.user_metadata
  userTransactions.value = transactions as Transaction[]
  fullName.value = `${firstName} ${lastName}`
  try {
    loading.value = true

    const { sum, assetPrices } = await computeAssetsPrices(digitalWallet)

    if (sum)
      walletBalance.value = sum

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
  const { success, message } = await userStore.logout()
  $q.notify({
    message,
    color: (success) ? 'positive' : 'negative',
  })
  if (success) router.push({ name: 'marketplace' })
}
</script>

<template>
  <div class="my-20">
    <div v-if="loading" class="centered">
      <CubeLoader />
    </div>
    <div v-else class="flex flex-col gap-y-5 items-center">
      <p class="text-xl">Glad to see you again {{ fullName }}</p>
      <p class="text-3xl font-semibold">{{ formattedWalletBalance }}</p>
      <p :class="`text-xl font-semibold ${getColor}`">{{ formattedProfitLoss }}</p>
      <q-btn @click="privateMode = !privateMode" label="Private mode" color="primary" />
      <q-btn @click="signOut" label="Sign out" color="negative" />
    </div>

    <CustomChart v-if="!privateMode && data" type="doughnut" :data="data" title="Allocation" />

    <UserTransactions :transactions="userTransactions" />
  </div>
</template>
