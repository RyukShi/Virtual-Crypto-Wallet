<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { inject } from 'vue'

const userStore = inject('userStore')
</script>

<template>
  <div class="centered mt-4">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink v-if="!userStore.isAuthenticated" to="/login">Login</RouterLink>
      <RouterLink v-else to="/my-wallet">Wallet</RouterLink>
    </nav>
  </div>

  <RouterView />
</template>

<style scoped>
nav {
  @apply flex gap-x-4 text-lg bg-sky-900 py-2 px-10 max-w-max rounded-3xl
  border-2 border-sky-900
  /* hover */
  hover:px-48 duration-700 hover:bg-transparent hover:border-amber-500;
}
nav a.router-link-exact-active {
  @apply border-b-2 border-amber-500;
}
nav a {
  @apply hover:text-amber-500 px-2;
}
</style>
