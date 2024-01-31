<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type UserAuthenticationData } from '@/stores/user-store'
import type { QForm } from 'quasar'
import { SECURE_PASSWORD_RULES_VALIDATIONS } from '@/common/security-utils'

const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')

const signUpMode = ref(false)
const authForm = ref<QForm>()

const userStore = useUserStore()
const router = useRouter()

const toggleModeButtonLabel = computed(() => (signUpMode.value) ? 'You have already an account ?' : 'Register now !')
const submitButtonLabel = computed(() => (signUpMode.value) ? 'Sign up' : 'Sign in')

const handleSubmit = async () => {
  const isValidForm = await authForm.value?.validate()
  if (!isValidForm) return

  const data: UserAuthenticationData = { password: password.value, email: email.value }
  if (signUpMode.value) {
    data.firstName = firstName.value
    data.lastName = lastName.value
  }
  const success = await userStore.authentication(signUpMode.value, data)
  if (success) {
    (signUpMode.value) ? router.push({ name: 'marketplace' }) : router.push({ name: 'my-wallet' })
  }
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" ref="authForm" @submit.prevent="handleSubmit">

      <q-input v-model="email" type="email" outlined clearable required label="E-mail" />
      <q-input v-if="signUpMode" v-model="confirmEmail" type="email" outlined clearable required label="Confirm e-mail" />

      <div v-if="signUpMode" class="flex justify-between">
        <q-input v-model="firstName" outlined clearable required label="First name" />
        <q-input v-model="lastName" outlined clearable required label="Last name" />
      </div>

      <q-input v-model="password" type="password" outlined clearable required label="Password"
        :rules="SECURE_PASSWORD_RULES_VALIDATIONS" />
      <q-input v-if="signUpMode" v-model="confirmPassword" type="password" outlined clearable required
        label="Confirm password" :rules="SECURE_PASSWORD_RULES_VALIDATIONS" />

      <div class="flex justify-between">
        <q-btn :label="submitButtonLabel" type="submit" color="primary" />
        <q-btn @click="signUpMode = !signUpMode" :label="toggleModeButtonLabel" type="button" color="positive" />
      </div>

      <RouterLink v-if="!signUpMode" to="/account-recovery">Forgot password ?</RouterLink>
    </q-form>
  </div>
</template>
