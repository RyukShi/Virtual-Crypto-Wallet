<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore, type UserAuthenticationData } from '@/stores/user-store'

const email = ref('')
const confirmEmail = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')

const signUpMode = ref(false)

const userStore = useUserStore()
const router = useRouter()

const toggleButtonLabel = computed(() => (signUpMode) ? 'You have already an account ?' : 'Register now !')

const submittedForm = async () => {
  const data: UserAuthenticationData = { password: password.value, email: email.value }
  if (signUpMode.value) {
    data.email = email.value
    data.password = password.value
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
    <!-- disabled reloading -->
    <form class="auth-form" @submit.prevent="submittedForm">
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
      <div class="flex flex-col items-center gap-y-10">
        <button class="btn btn-sky" type="submit">{{ (signUpMode) ? 'Sign up' : 'Sign in' }}</button>
        <button class="btn btn-sky" type="button" @click="signUpMode = !signUpMode">
          {{ toggleButtonLabel }}
        </button>
        <RouterLink v-if="!signUpMode" to="/account-recovery">Forgot password ?</RouterLink>
      </div>
    </form>
  </div>
</template>
