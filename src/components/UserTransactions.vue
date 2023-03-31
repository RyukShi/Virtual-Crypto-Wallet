<script setup>
defineProps({
  transactions: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div>
    <div v-if="transactions.length > 0">
      <h2 class="sub-title text-center">
        Your transactions
      </h2>
      <div class="flex flex-col gap-y-5 items-center justify-center">
        <div v-for="t in transactions" class="transaction" :key="t.date">
          <h3>{{ `${t.type} ${t.date}` }}</h3>
          <p>{{ `From asset : ${t.from_asset_amount} ${t.from_asset_id}` }}</p>
          <p>{{ `To asset : ${t.to_asset_amount} ${t.to_asset_id}` }}</p>
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="sub-title text-center">
        No transactions, you can buy many assets 
        <RouterLink to="/swapping">here</RouterLink>
      </h2>
    </div>
  </div>
</template>

<style scoped>
.transaction {
  @apply bg-sky-900 p-8 rounded-lg border-2 text-center max-w-max;
}

.transaction h3 {
  @apply text-lg mb-4;
}
</style>
