<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import { SECURE_PASSWORD_RULES } from '@/common/security-utils'

const newPassword = ref('')
const confirmNewPassword = ref('')
const showPassword = ref(false)

const router = useRouter()
const userStore = useUserStore()

const isNotSamePasswords = computed(() =>
  !!confirmNewPassword.value && newPassword.value !== confirmNewPassword.value)

const handleSubmit = async () => {
  await userStore.updatePassword(newPassword.value)
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" @submit.prevent="handleSubmit">

      <q-input
        v-model="newPassword"
        label="New password"
        :type="(showPassword) ? 'text' : 'password'"
        :rules="SECURE_PASSWORD_RULES"
        outlined clearable required>
        <template #append>
          <q-icon :name="(showPassword) ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>
      <q-input
        v-model="confirmNewPassword"
        label="Confirm new password"
        :type="(showPassword) ? 'text' : 'password'"
        :error="isNotSamePasswords"
        error-message="The two passwords do not match."
        outlined clearable required>
        <template #append>
          <q-icon :name="(showPassword) ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <q-btn type="submit" label="Reset my password" color="primary" />
    </q-form>
  </div>
</template>
