<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useUserStore } from '../stores/user-store'
import { useRouter } from 'vue-router'

const email = ref('');
const confirmEmail = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');

const signUpMode = ref(false);

const userStore = useUserStore()
const router = useRouter()

const submitedForm = async () => {
  if (signUpMode.value) {
    try {
      const { error } = await supabase.auth.signUp(
        {
        email: email.value,
        password: password.value
        },
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
      const { user, error } = await supabase.auth.signIn({
        email: email.value,
        password: password.value
      })

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

const changeMode = () => {
  signUpMode.value = !signUpMode.value
}

</script>

<template>
  <div v-if="!userStore.login" class="">
    <!-- disabled reloading -->
    <form class="" @submit.prevent="submitedForm">
      <div>
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div v-if="signUpMode">
        <label for="confirmEmail">Confirm email</label>
        <input type="email" id="confirmEmail" v-model="confirmEmail" required />
      </div>
      <div v-if="signUpMode">

        <label for="firstName">First name</label>
        <input type="text" id="firstName" v-model="firstName" required />

        <label for="lastName">Last name</label>
        <input type="text" id="lastName" v-model="lastName" required />

      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div v-if="signUpMode">
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <div>
        <button type="submit">{{ signUpMode ? 'Sign up' : 'Sign in' }}</button>
      </div>
      <div>
        <!-- Just for development purposes -->
        <button type="button" @click="changeMode">changeMode</button>
      </div>
    </form>
  </div>
</template>