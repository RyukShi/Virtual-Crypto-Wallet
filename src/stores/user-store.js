import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user-store', () => {
  const user = ref(null)
  const login = ref(false)

  const setUser = (newUser) => {
    user.value = newUser
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // reset store
      user.value = null
      login.value = false
    } catch (error) {
      console.log(error)
    }
  }

  return {
    user, login, logout,
    setUser
  }
})
