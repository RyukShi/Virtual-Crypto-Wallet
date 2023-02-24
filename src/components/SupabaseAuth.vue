<script setup>
import { ref, computed, watch } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/user-store'
import { useRouter } from 'vue-router'
import isEmail from 'validator/lib/isEmail'

const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')

const signUpMode = ref(false)

const errorMessages = {
  email: null,
  password: null,
  confirmEmail: null,
  confirmPassword: null,
}

const userStore = useUserStore()
const router = useRouter()

const isSameEmail = computed(() => email.value === confirmEmail.value)
const isSamePassword = computed(() => password.value === confirmPassword.value)
const isValidEmail = computed(() => isEmail(email.value))
const isValidPassword = computed(() => password.value.length >= 8)
const isFormComplete = computed(() => {
  let formFields = null
  if (signUpMode.value) {
    formFields = [
      email.value, confirmEmail.value, password.value,
      confirmPassword.value, firstName.value, lastName.value
    ]
  } else {
    formFields = [ email.value, password.value ]
  }
  return formFields.every((field) => field !== '')
})

const isValidForm = computed(() => {
  if (!isFormComplete.value || !isValidEmail.value || !isValidPassword.value) return false
  else if (confirmEmail.value && !isSameEmail.value) return false
  else if (confirmPassword.value && !isSamePassword.value) return false
  else return true
})

watch([isValidEmail, isSameEmail, isSamePassword, isValidPassword], (values) => {
  const [validEmail, sameEmail, samePassword, validPassword] = values
  if (!validEmail) errorMessages.email = 'Invalid email'
  else errorMessages.email = null

  if (signUpMode.value && !sameEmail) errorMessages.confirmEmail = 'Emails do not match'
  else errorMessages.confirmEmail = null

  if (signUpMode.value && !samePassword) errorMessages.confirmPassword = 'Passwords do not match'
  else errorMessages.confirmPassword = null

  if (signUpMode.value && !validPassword) errorMessages.password = 'Password must be at least 8 characters'
  else errorMessages.password = null
})

const submitedForm = async () => {
  if (signUpMode.value) {
    try {
      const { error } = await supabase.auth.signUp(
        { email: email.value, password: password.value },
        {
          data: {
            firstName: firstName.value,
            lastName: lastName.value
          }
        }
      )

      if (error) throw error

      alert('Check your email to confirm your registration !')

    } catch (error) {
      console.log(error);
      alert(error.error_description || error.message)
    }
  } else {
    try {
      const { user, error } = await supabase.auth.signIn(
        { email: email.value, password: password.value })

      if (error) throw error

      userStore.setUser(user)
      userStore.login = true

      // redirect to my-wallet page
      router.push('/my-wallet')

    } catch (error) {
      console.log(error);
      alert(error.error_description || error.message)
    }
  }
}
</script>

<template>
  <div class="centered" v-if="!userStore.login">
    <!-- disabled reloading -->
    <form class="auth-form" @submit.prevent="submitedForm">
      <div>
        <input type="email" v-model="email" required placeholder="Your e-mail" />
        <p v-if="errorMessages.email" class="error-message">{{ errorMessages.email }}</p>
      </div>
      <div v-if="signUpMode">
        <input type="email" v-model="confirmEmail" required placeholder="Confirm your e-mail" />
        <p v-if="errorMessages.confirmEmail" class="error-message">{{ errorMessages.confirmEmail }}</p>
      </div>
      <div class="flex gap-x-4" v-if="signUpMode">
        <input type="text" v-model="firstName" required placeholder="Your firstname" />
        <input type="text" v-model="lastName" required placeholder="Your lastname" />
      </div>
      <div>
        <input type="password" v-model="password" required placeholder="Your password" />
        <p v-if="errorMessages.password" class="error-message">{{ errorMessages.password }}</p>
      </div>
      <div v-if="signUpMode">
        <input type="password" v-model="confirmPassword" required placeholder="Confirm your password" />
        <p v-if="errorMessages.confirmPassword" class="error-message">{{ errorMessages.confirmPassword }}</p>
      </div>
      <div class="flex flex-col items-center gap-y-10">
        <button :disabled="!isValidForm" class="btn btn-sky" type="submit">{{ (signUpMode) ? 'Sign up' : 'Sign in' }}</button>
        <button class="btn btn-sky" type="button" @click="signUpMode = !signUpMode">
          {{ (signUpMode) ? 'You have already an account ?' : 'Register now !' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  @apply my-10 p-10 bg-sky-700 rounded-lg flex flex-col gap-y-6;
}

.error-message {
  @apply text-sm mt-2 px-2 bg-rose-500 max-w-max rounded-lg;
}
</style>
