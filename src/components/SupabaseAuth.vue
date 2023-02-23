<script setup>
import { ref, computed } from 'vue'
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

const userStore = useUserStore()
const router = useRouter()

const isValidEmail = computed(() => isEmail(email.value) && email.value === confirmEmail.value)
const isValidPassword = computed(() => password.value === confirmPassword.value)

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

      // redirect to home page
      router.push('/')

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
      </div>
      <div v-if="signUpMode">
        <input type="email" v-model="confirmEmail" required placeholder="Confirm your e-mail" />
      </div>
      <div class="flex gap-x-4" v-if="signUpMode">
        <input type="text" v-model="firstName" required placeholder="Your firstname" />
        <input type="text" v-model="lastName" required placeholder="Your lastname" />
      </div>
      <div>
        <input type="password" v-model="password" required placeholder="Your password" />
      </div>
      <div v-if="signUpMode">
        <input type="password" v-model="confirmPassword" required placeholder="Confirm your password" />
      </div>
      <div class="centered gap-x-4">
        <button class="btn btn-sky" type="submit">{{ (signUpMode) ? 'Sign up' : 'Sign in' }}</button>
        <button class="btn btn-sky" type="button" @click="signUpMode = !signUpMode">
          {{ (signUpMode) ? 'You have already an account ?' : 'Register now !' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  @apply my-10 p-10 bg-sky-900 rounded-lg flex flex-col gap-y-6;
}
</style>
