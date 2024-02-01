import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useAPIStore } from './api-store'
import { AuthError, type User } from '@supabase/supabase-js'

export type UserAuthenticationData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export type Transaction = {
  date: string;
  type: string;
  from_asset_amount: number;
  to_asset_amount: number;
  to_asset_id: string;
  from_asset_id: string;
}

export type DigitalCurrency = {
  asset_id: string;
  balance: number;
  name: string;
  color: string;
}

export type DigitalWallet = DigitalCurrency[]

export const useUserStore = defineStore('user-store', () => {
  const user = ref<User>()
  const isAuthenticated = ref(false)

  const DEFAULT_REGISTRATION_ASSETS = [
    { asset_id: 'ETH', color: '#3C9EFF', amount_usd: 250 },
    { asset_id: 'BTC', color: '#FFA93C', amount_usd: 250 },
    { asset_id: 'USDC', color: '#3EC5A3', amount_usd: 1000 }
  ]

  const authentication = async (signUpMode: boolean, userAuthData: UserAuthenticationData) => {
    const APIStore = useAPIStore()
    if (signUpMode) {
      try {
        const assetsUpdated = await Promise.all(
          DEFAULT_REGISTRATION_ASSETS
            .map(asset => APIStore.getAssetById(asset.asset_id, true))
        )

        const digitalWallet = assetsUpdated
          .map(asset => {
            const findDefaultAsset = DEFAULT_REGISTRATION_ASSETS.find(
              defaultAsset => defaultAsset.asset_id === asset?.asset_id)

            if (findDefaultAsset && asset) {
              const { asset_id, name, price_usd } = asset
              const { amount_usd, color } = findDefaultAsset
              return {
                asset_id,
                name,
                balance: amount_usd / price_usd,
                color
              } as DigitalCurrency
            }
          })

        const { error } = await supabase.auth.signUp(
          {
            email: userAuthData.email, password: userAuthData.password,
            options: {
              data: {
                firstName: userAuthData.firstName,
                lastName: userAuthData.lastName,
                digitalWallet,
                transactions: []
              }
            }
          }
        )

        if (error) throw error

        return { success: true, message: 'Check your email to confirm your registration !' }
      } catch (error) {
        if (error instanceof AuthError)
          return { success: false, message: error.message }
      }
    } else {
      try {
        const { data, error } = await supabase.auth.signInWithPassword(
          { email: userAuthData.email, password: userAuthData.password })

        if (error) throw error

        user.value = data.user
        isAuthenticated.value = true
        const { lastName, firstName } = user.value.user_metadata
        return { success: true, message: `Glad to see you again ${firstName} ${lastName}` }
      } catch (error) {
        if (error instanceof AuthError)
          return { success: false, message: error.message }
      }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      // reset store
      user.value = undefined
      isAuthenticated.value = false
    } catch (error) {
      alert("An error has occurred during the logout process.")
      console.error(error)
    }
  }

  const sendRecoveryPasswordLink = async (email: string) => {
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

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      alert("Your password has been successfully reinitialized, you'll be soon redirected to the login page.")
    } catch (error) {
      alert("An error has occurred during the recovery password process, please try again later.")
      console.error(error)
    }
  }

  const updateDigitalWallet = async (newDigitalWallet: DigitalWallet) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { digitalWallet: newDigitalWallet }
      })
      if (error) throw error
    } catch (error) {
      console.error(error)
    }
  }

  const updateTransactions = async (newTransactions: Transaction[]) => {
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
