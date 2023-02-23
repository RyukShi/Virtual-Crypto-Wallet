<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/user-store'

const userStore = useUserStore()
</script>

<template>
  <div class="centered mt-4">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink v-if="!userStore.login" to="/login">Login</RouterLink>
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
  @apply text-amber-500;
}
</style>
