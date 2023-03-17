<script setup>
import { ref, computed, inject, onBeforeMount } from 'vue'
import { formatedNumber } from '../utils'
import { useRouter } from 'vue-router'
import CustomChart from './CustomChart.vue'

const userStore = inject('userStore')
const APIStore = inject('APIStore')
const router = useRouter()
const data = ref(null)

const { digitalWallet, initialBalance,
        firstName, lastName } = userStore.user.user_metadata
const stars = '********'

onBeforeMount(async () => {
  if (digitalWallet) {
    let assets = await Promise.all(digitalWallet.map(a => APIStore.getAssetById(a.asset_id)))
    /* flat assets array */
    assets = assets.flat()
    data.value = {
      labels: digitalWallet.map(a => a.asset_id),
      datasets: [{
        data: digitalWallet.map(a => a.balance * assets.find(asset => asset.asset_id === a.asset_id).price_usd),
        backgroundColor: digitalWallet.map(a => a.color),
        hoverOffset: 4
      }]
    }
  }
})

const Accountbalance = ref(initialBalance)
const privateMode = ref(false)
const profitLoss = ref(100.118)

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
    <div class="flex flex-col gap-y-5 items-center">
      <p class="text-xl">Glad to see you again {{ fullName }}</p>
      <p class="text-3xl font-semibold">{{ formatedAccountBalance }}</p>
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
