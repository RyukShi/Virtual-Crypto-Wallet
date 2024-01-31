<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'

const router = useRouter()

const emailRecovery = ref('')
const userStore = useUserStore()

const handleSubmit = async () => {
  await userStore.sendRecoveryPasswordLink(emailRecovery.value)
  router.push({ name: 'marketplace' })
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" @submit.prevent="handleSubmit">
      <q-input outlined clearable type="email" v-model="emailRecovery" label="E-mail" />
      <div class="flex justify-center">
        <q-btn type="submit" label="Send me recovery link" color="primary" />
      </div>
    </q-form>
  </div>
</template>
