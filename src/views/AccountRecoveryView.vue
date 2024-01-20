<script setup lang="ts">
import { ref, computed } from 'vue'
import isEmail from 'validator/lib/isEmail'
import { useRouter } from 'vue-router'

const router = useRouter()

const emailRecovery = ref('')
const userStore = useUserStore()

const isValidEmail = computed(() => isEmail(emailRecovery.value))

const handleSubmit = async () => {
  await userStore.sendRecoveryPasswordLink(emailRecovery.value)
  router.push({ name: 'marketplace' })
}
</script>

<template>
  <div class="centered">
    <form class="auth-form"
      @submit.prevent="handleSubmit">
      <div>
        <input type="email" v-model="emailRecovery" placeholder="Enter your e-mail" />
        <p v-if="emailRecovery && !isValidEmail" class="error-message">Invalid email</p>
      </div>
      <div class="flex gap-x-4">
        <button
          :disabled="!isValidEmail"
          type="submit"
          class="btn btn-sky">
          Send me recovery link
        </button>
        <RouterLink
          class="btn btn-rose"
          to="/login">
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>
