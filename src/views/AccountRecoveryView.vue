<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user-store'
import { NOT_BLANK_RULE } from '@/common/security-utils'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const emailRecovery = ref('')
const userStore = useUserStore()

const handleSubmit = async () => {
  const { success, message } = await userStore.sendRecoveryPasswordLink(emailRecovery.value)
  $q.dialog({
    title: 'Message alert',
    message,
    color: (success) ? 'positive' : 'negative',
  }).onOk(() => {
    if (success) router.push({ name: 'marketplace' })
  })
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" @submit.prevent="handleSubmit">
      <q-input outlined clearable required type="email" v-model="emailRecovery" label="E-mail" :rules="NOT_BLANK_RULE" />
      <div class="flex justify-center">
        <q-btn type="submit" label="Send me recovery link" color="primary" />
      </div>
    </q-form>
  </div>
</template>
