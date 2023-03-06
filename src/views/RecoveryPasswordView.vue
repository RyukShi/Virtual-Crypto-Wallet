<script setup>
import { ref, inject, computed } from 'vue'
import { isSecurePassword } from '../utils'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = inject('userStore')
const newPassword = ref('')
const confirmNewPassword = ref('')

const isSamePassword = computed(() => newPassword.value === confirmNewPassword.value)
const isValidPassword = computed(() => isSecurePassword(newPassword.value))
const isValidForm = computed(() => {
  if (newPassword.value && !isSamePassword.value) return false
  else if (!isValidPassword.value) return false
  else return true
})

const handleSubmit = async () => {
  await userStore.updatePassword(newPassword.value)
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="centered">
    <form class="my-10 p-10 bg-sky-700 rounded-lg flex flex-col gap-y-6 items-center"
      @submit.prevent="handleSubmit">
      <input type="password" v-model="newPassword" required placeholder="Enter your new password" />
      <input type="password" v-model="confirmNewPassword" required placeholder="Confirm your new password" />
      <button class="btn btn-sky" type="submit" :disabled="!isValidForm">
        Change my password
      </button>
    </form>
  </div>
</template>
