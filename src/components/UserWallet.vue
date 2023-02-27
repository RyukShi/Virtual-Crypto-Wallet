<script setup>
import { ref, computed } from 'vue'
import { formatedNumber } from '../utils'
import { useUserStore } from '../stores/user-store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
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
  </div>
</template>
