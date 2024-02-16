<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Transaction } from '@/stores/user-store'
import { formattedDate } from '@/utils'

const router = useRouter()

type UserTransactionProps = {
  transactions: Transaction[]
}

defineProps<UserTransactionProps>()
</script>

<template>
  <div v-if="transactions.length > 0">
    <h2 class="sub-title text-center">
      Your transactions
    </h2>
    <div class="grid grid-cols-4 gap-4">
      <q-card class="bg-primary" v-for="t in transactions" :key="t.date" bordered>
        <q-card-section>{{ formattedDate(t.date) }}</q-card-section>
        <q-card-section>
          <p>{{ `From asset : ${t.from_asset_amount} ${t.from_asset_id}` }}</p>
          <p>{{ `To asset : ${t.to_asset_amount} ${t.to_asset_id}` }}</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <div v-else class="centered">
    <q-banner rounded inline-actions class="text-white bg-primary">
      No transactions, you can buy many assets !
      <template #action>
        <q-btn outline color="white" @click="router.push({ name: 'swapping' })" label="BUY ASSETS" />
      </template>
    </q-banner>
  </div>
</template>
