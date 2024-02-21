import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../supabase'
import { useAPIStore, type Asset } from './api-store'
import { type User } from '@supabase/supabase-js'
import { Tables, insertRows } from '@/common/supabase-utils'

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
        const assetsResults: Array<Asset> = []

        for (const asset of DEFAULT_REGISTRATION_ASSETS) {
          let result = await APIStore.getAssetById(asset.asset_id, true)
          if (result?.asset_id) {
            assetsResults.push(result)
          } else {
            const MAX_RETRY = 10
            let count = 0
            while (!result && count < MAX_RETRY) {
              result = await APIStore.getAssetById(asset.asset_id, true)
              count++
            }
            if (result?.asset_id) assetsResults.push(result)
          }
        }

        const digitalWallet = assetsResults
          .map(asset => {
            const findDefaultAsset = DEFAULT_REGISTRATION_ASSETS.find(
              defaultAsset => defaultAsset.asset_id === asset.asset_id)

            if (findDefaultAsset) {
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

        const { data, error } = await supabase.auth.signUp(
          {
            email: userAuthData.email, password: userAuthData.password,
            options: {
              data: {
                firstName: userAuthData.firstName,
                lastName: userAuthData.lastName,
              }
            }
          }
        )

        if (error) throw error

        const success = await insertRows([
          { digital_wallet: digitalWallet, user_id: data.user?.id }
        ], Tables.DigitalWallets)

        if (!success) throw new Error('An error has occurred during the registration process, please try again later.')

        return { success: true, message: 'Check your email to confirm your registration !' }
      } catch (error) {
        return { success: false, message: (error as Error).message }
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
        return { success: false, message: (error as Error).message }
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

      return {
        success: true,
        message: "Logout completed successfully."
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "An error has occurred during the logout process."
      }
    }
  }

  const sendRecoveryPasswordLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/recovery-password"
      })
      if (error) throw error

      return {
        success: true,
        message: `A recovery email has been sent to ${email}, please verify and follow the instructions.`,
      }

    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "An error has occurred during the process, please try again later."
      }
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error

      return {
        success: true,
        message: "Your password has been successfully reinitialized.",
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: "An error has occurred during the recovery password process, please try again later.",
      }
    }
  }

  return {
    user, isAuthenticated, logout,
    sendRecoveryPasswordLink, updatePassword,
    authentication
  }
})
