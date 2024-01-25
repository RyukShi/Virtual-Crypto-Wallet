<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type UserAuthenticationData } from '@/stores/user-store'
import type { QForm } from 'quasar'

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
    <q-form class="p-4" ref="authForm" @submit.prevent="handleSubmit">

      <q-input v-model="email" type="email" clearable required placeholder="Your e-mail" />
      <q-input v-if="signUpMode" v-model="confirmEmail" type="email" clearable required
        placeholder="Confirm your e-mail" />

      <div v-if="signUpMode">
        <q-input v-model="firstName" clearable required placeholder="Your first name" />
        <q-input v-model="lastName" clearable required placeholder="Your last name" />
      </div>

      <q-input v-model="password" type="password" clearable required placeholder="Your password" />
      <q-input v-if="signUpMode" v-model="confirmPassword" type="password" clearable required
        placeholder="Confirm your password" />

      <div class="mt-8">
        <q-btn class="mr-4" :label="submitButtonLabel" type="submit" color="primary" />
        <q-btn @click="signUpMode = !signUpMode" :label="toggleModeButtonLabel" type="button" color="primary" />
      </div>

      <RouterLink v-if="!signUpMode" to="/account-recovery">Forgot password ?</RouterLink>
    </q-form>
  </div>
</template>
