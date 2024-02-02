<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type UserAuthenticationData } from '@/stores/user-store'
import type { QForm } from 'quasar'
import { SECURE_PASSWORD_RULES, NOT_BLANK_RULE } from '@/common/security-utils'
import { useQuasar } from 'quasar'

/* String refs */
const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
/* Boolean refs */
const signUpMode = ref(false)
const showPassword = ref(false)

const authForm = ref<QForm>()

const userStore = useUserStore()
const router = useRouter()
const $q = useQuasar()

/* Computed refs */
const toggleModeButtonLabel = computed(() => (signUpMode.value) ? 'You have already an account ?' : 'Register now !')
const submitButtonLabel = computed(() => (signUpMode.value) ? 'Sign up' : 'Sign in')
const isNotSamePasswords = computed(() => !!confirmPassword.value && password.value !== confirmPassword.value)
const isNotSameEmails = computed(() => !!confirmEmail.value && email.value !== confirmEmail.value)

const handleSubmit = async () => {
  const isValidForm = await authForm.value?.validate()
  if (!isValidForm) return

  const data: UserAuthenticationData = { password: password.value, email: email.value }
  if (signUpMode.value) {
    data.firstName = firstName.value
    data.lastName = lastName.value
  }
  const { success, message } = await userStore.authentication(signUpMode.value, data)
  if (signUpMode.value) {
    $q.dialog({
      title: 'Message alert',
      message,
      color: (success) ? 'positive' : 'negative',
    }).onOk(() => {
      if (success) router.push({ name: 'marketplace' })
    })
  } else {
    $q.notify({
      message,
      color: (success) ? 'positive' : 'negative',
      caption: 'Authentication'
    })
    if (success) router.push({ name: 'my-wallet' })
  }
}

const toggleMode = () => {
  authForm.value?.resetValidation()
  signUpMode.value = !signUpMode.value
}
</script>

<template>
  <div class="centered">
    <q-form autofocus class="auth-form" ref="authForm" @submit.prevent="handleSubmit">

      <q-input
        v-model="email"
        label="E-mail"
        type="email"
        :rules="NOT_BLANK_RULE"
        outlined clearable required />
      <q-input v-if="signUpMode"
        v-model="confirmEmail"
        label="Confirm e-mail"
        type="email"
        :rules="NOT_BLANK_RULE"
        :error="isNotSameEmails"
        error-message="The two emails do not match."
        outlined clearable required />

      <div v-if="signUpMode" class="flex justify-between">
        <q-input v-model="firstName" label="First name"
          :rules="NOT_BLANK_RULE" outlined clearable required />
        <q-input v-model="lastName" label="Last name"
          :rules="NOT_BLANK_RULE" outlined clearable required />
      </div>

      <q-input
        v-model="password"
        label="Password"
        :type="(showPassword) ? 'text' : 'password'"
        :rules="(signUpMode) ? SECURE_PASSWORD_RULES : undefined"
        outlined clearable required>
        <template #append>
          <q-icon :name="(showPassword) ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>
      <q-input v-if="signUpMode"
        v-model="confirmPassword"
        label="Confirm password"
        :type="(showPassword) ? 'text' : 'password'"
        :error="isNotSamePasswords"
        error-message="The two passwords do not match."
        outlined clearable required>
        <template #append>
          <q-icon :name="(showPassword) ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showPassword = !showPassword" />
        </template>
      </q-input>

      <div class="flex justify-between">
        <q-btn :label="submitButtonLabel" type="submit" color="primary" />
        <q-btn @click="toggleMode" :label="toggleModeButtonLabel" type="button" color="positive" />
      </div>

      <RouterLink v-if="!signUpMode" to="/account-recovery">Forgot password ?</RouterLink>
    </q-form>
  </div>
</template>
