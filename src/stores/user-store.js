import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useAPIStore } from './api-store'

export const useUserStore = defineStore('user-store', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const authentication = async (signUpMode, userAuthData) => {
    const APIStore = useAPIStore()
    if (signUpMode) {
      const defaultRegistrationtAssets = [
        { asset_id: 'ETH', color: '#3C9EFF', amount_usd: 250 },
        { asset_id: 'BTC', color: '#FFA93C', amount_usd: 250 },
        { asset_id: 'USDC', color: '#3EC5A3', amount_usd: 1000 }
      ]
      try {
        const userAssets = await Promise.all(
          defaultRegistrationtAssets
            .map(async (asset) => {
              let updateAsset = await APIStore.getAssetById(asset.asset_id)
              let b = asset.amount_usd / updateAsset[0].price_usd
              delete asset.amount_usd
              return {
                ...asset,
                name: updateAsset[0].name,
                balance: b
              }
            })
        )
        const { error } = await supabase.auth.signUp(
          {
            email: userAuthData.email, password: userAuthData.password,
            options: {
              data: {
                firstName: userAuthData.firstName,
                lastName: userAuthData.lastName,
                digitalWallet: userAssets,
                transactions: []
              }
            }
          }
        )

        if (error) throw error

        alert('Check your email to confirm your registration !')
        return true
      } catch (error) {
        alert(error.error_description || error.message)
        return false
      }
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword(
          { email: userAuthData.email, password: userAuthData.password })

        if (error) throw error

        user.value = data.user
        isAuthenticated.value = true
        return true
      } catch (error) {
        alert(error.error_description || error.message)
        return false
      }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // reset store
      user.value = null
      isAuthenticated.value = false
    } catch (error) {
      alert("An error has occurred during the logout process.")
      console.error(error)
    }
  }

  const sendRecoveryPasswordLink = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/recovery-password"
      })
      if (error) throw error

      alert(`A recovery email has been sent to ${email}, please verify and follow the instructions.`)

    } catch (error) {
      alert("An error has occurred during the process, please try again later.")
      console.error(error)
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert("Your password has been successfully reinitialized, you'll be soon redirected to the login page.")
    } catch (error) {
      alert("An error has occurred during the recovery password process, please try again later.")
      console.error(error)
    }
  }

  const updateDigitalWallet = async (newDigitalWallet) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { digitalWallet: newDigitalWallet }
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const updateTransactions = async (newTransactions) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { transactions: newTransactions }
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  return {
    user, isAuthenticated, logout,
    sendRecoveryPasswordLink, updatePassword,
    updateDigitalWallet, authentication,
    updateTransactions
  }
})
