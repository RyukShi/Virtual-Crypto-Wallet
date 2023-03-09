<script setup>
import { ref, computed, inject } from 'vue'
import { formatedNumber } from '../utils'
import { useRouter } from 'vue-router'
import CustomChart from './CustomChart.vue'

const userStore = inject('userStore')
const router = useRouter()

const userMetadata = userStore.user.user_metadata
const stars = '********'

const Accountbalance = ref(userMetadata.initialBalance)
const privateMode = ref(false)
const profitLoss = ref(100.118)

const fullName = computed(() => {
  return `${userMetadata.firstName} ${userMetadata.lastName}`
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

const data = {
  labels: [
    'Red',
    'Blue',
    'Yellow'
  ],
  datasets: [{
    data: [300, 50, 100],
    backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4
  }]
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

    <CustomChart v-if="!privateMode" type="doughnut" :data="data"
      title="Allocation" />
  </div>
</template>
