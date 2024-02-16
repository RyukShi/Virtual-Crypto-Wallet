import type { DigitalWallet, Transaction } from '@/stores/user-store'
import { supabase } from '@/supabase'
import type { PostgrestError } from '@supabase/supabase-js'

export enum Tables {
  Transactions = 'transactions',
  DigitalWallets = 'digital_wallets',
}

export const insertRows = async (rows: object[] | object, table: Tables) => {
  try {
    const { error } = await supabase
      .from(table)
      .insert(rows)

    if (error) throw error

    return true
  } catch (error) {
    console.error((error as PostgrestError).message)
    return false
  }
}

export const getUserWallet = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from(Tables.DigitalWallets)
      .select('digital_wallet')
      .eq('user_id', userId)

    if (error) throw error

    console.log(data)

    return data[0].digital_wallet as DigitalWallet
  } catch (error) {
    console.error((error as PostgrestError).message)
  }
}

export const updateDigitalWallet = async (newDigitalWallet: DigitalWallet, userId: string) => {
  try {
    const { data, error } = await supabase
      .from(Tables.DigitalWallets)
      .update({ digital_wallet: newDigitalWallet })
      .eq('user_id', userId)
      .select()

    if (error) throw error

    console.log(data)

    return true
  } catch (error) {
    console.error((error as PostgrestError).message)
    return false
  }
}

export const getUserTransactions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from(Tables.Transactions)
      .select()
      .eq('user_id', userId)

    if (error) throw error

    return data as Transaction[]
  } catch (error) {
    console.error((error as PostgrestError).message)
  }
}