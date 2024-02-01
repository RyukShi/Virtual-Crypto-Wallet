<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import { SECURE_PASSWORD_RULES } from '@/common/security-utils'

const router = useRouter()

const userStore = useUserStore()
const newPassword = ref('')
const confirmNewPassword = ref('')

const isSamePassword = computed(() => newPassword.value === confirmNewPassword.value)

const handleSubmit = async () => {
  await userStore.updatePassword(newPassword.value)
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" @submit.prevent="handleSubmit">
      <q-input type="password" outlined clearable v-model="newPassword" required label="New password"
        :rules="SECURE_PASSWORD_RULES" />
      <q-input type="password" outlined clearable v-model="confirmNewPassword" required label="Confirm new password"
        :rules="SECURE_PASSWORD_RULES" />
      <q-btn type="submit" :disabled="!isSamePassword" label="Reset my password" color="primary" />
    </q-form>
  </div>
</template>
