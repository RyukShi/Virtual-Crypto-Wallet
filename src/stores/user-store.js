import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user-store', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // reset store
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      console.log(error)
    }
  }

  return {
    user, isAuthenticated, logout
  }
})
