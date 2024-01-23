<script setup lang="ts">
import { ref, computed } from 'vue'
import { isSecurePassword } from '../utils'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'

const router = useRouter()

const userStore = useUserStore()
const newPassword = ref('')
const confirmNewPassword = ref('')

const isSamePassword = computed(() => newPassword.value === confirmNewPassword.value)
const isValidPassword = computed(() => isSecurePassword(newPassword.value))
const isValidForm = computed(() => {
  if (newPassword.value && !isSamePassword.value) return false
  else if (!isValidPassword.value[0]) return false
  else return true
})

const handleSubmit = async () => {
  await userStore.updatePassword(newPassword.value)
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="centered">
    <form class="auth-form"
      @submit.prevent="handleSubmit">
      <div>
        <input type="password" v-model="newPassword" required placeholder="Enter your new password" />
        <p v-if="newPassword && !isValidPassword[0]" class="error-message">{{ isValidPassword[1] }}</p>
      </div>
      <div>
        <input type="password" v-model="confirmNewPassword" required placeholder="Confirm your new password" />
        <p v-if="confirmNewPassword && !isSamePassword" class="error-message">Passwords do not match</p>
      </div>
      <button class="btn btn-sky" type="submit" :disabled="!isValidForm">
        Change my password
      </button>
    </form>
  </div>
</template>
