<script setup>
import { ref, inject } from 'vue'
import isEmail from 'validator/lib/isEmail'
import { useRouter } from 'vue-router'

const router = useRouter()

const emailRecovery = ref('')
const userStore = inject('userStore')

const handleSubmit = async () => {
  await userStore.sendRecoveryPasswordLink(emailRecovery.value)
  router.push({ name: 'marketplace' })
}
</script>

<template>
  <div class="centered">
    <form class="my-10 p-10 bg-sky-700 rounded-lg flex flex-col gap-y-6 items-center"
      @submit.prevent="handleSubmit">
      <input type="email" v-model="emailRecovery" placeholder="Enter your e-mail" />
      <button
        :disabled="!isEmail(emailRecovery)"
        type="submit"
        class="btn btn-sky">
        Send me recovery link
      </button>
    </form>
  </div>
</template>
