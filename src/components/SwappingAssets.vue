<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRandomColor } from '../utils'
import CubeLoader from './CubeLoader.vue'
import { useUserStore, type DigitalCurrency, type DigitalWallet } from '@/stores/user-store'
import { useAPIStore, type Asset } from '@/stores/api-store'
import { getToAssetAmount } from '@/common/crypto-utils'
import { Tables, getUserWallet, insertRows, updateDigitalWallet } from '@/common/supabase-utils'
import { useQuasar } from 'quasar'

const userStore = useUserStore()
const APIStore = useAPIStore()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const selectedAsset = ref<DigitalCurrency & { label: string; }>()
const fromAssetAmount = ref<number>()
const destinationAsset = ref<Asset>()
const selectedAssetType = ref<number>()
const loading = ref(false)
const digitalWallet = ref<DigitalWallet>([])

onBeforeMount(async () => {
  if (!userStore.user) {
    router.push({ name: 'marketplace' })
    return
  }
  const userWallet = await getUserWallet(userStore.user.id)
  if (!userWallet) {
    router.push({ name: 'marketplace' })
    return
  }
  digitalWallet.value = userWallet

  let { assetId, assetType } = route.query
  /* Default is crypto type */
  selectedAssetType.value = (assetType) ? Number.parseInt(assetType as string) : 1
  if (!!assetId) {
    const findDestinationAsset = getFilteredAssets.value.find(asset => asset.asset_id === assetId)
    if (findDestinationAsset)
      destinationAsset.value = findDestinationAsset
  }
})

const getFilteredAssets = computed(() => {
  return APIStore.getFilteredAssets.filter(asset =>
    asset.type_is_crypto === selectedAssetType.value)
})
const isNotValidNumber = computed(() => !!fromAssetAmount.value && isNaN(fromAssetAmount.value))
const isNotValidAmount = computed(() => {
  if (fromAssetAmount.value && selectedAsset.value)
    return fromAssetAmount.value > selectedAsset.value.balance
  else return false
})
const isSameAsset = computed(() => {
  return !!selectedAsset.value && !!destinationAsset.value &&
    selectedAsset.value.asset_id === destinationAsset.value.asset_id
})

const PERCENTAGE_OPTIONS = [
  { percentage: 0.25, label: '25%' },
  { percentage: 0.5, label: '50%' },
  { percentage: 1, label: 'All' }
]

const DIGITAL_WALLET_OPTIONS = computed(() => digitalWallet.value
  .map(digitalCurrency => ({
    ...digitalCurrency,
    label: `${digitalCurrency.name} (${digitalCurrency.asset_id})`
  })))

const DESTINATION_ASSET_OPTIONS = computed(() => getFilteredAssets.value
  .map(asset => ({
    ...asset,
    label: `${asset.name} (${asset.asset_id})`
  })))

const handleSubmit = async () => {
  debugger
  if (!selectedAsset.value || !destinationAsset.value
    || !fromAssetAmount.value || !userStore.user) return

  const fromAssetId = selectedAsset.value.asset_id
  const fromAssetBalance = selectedAsset.value.balance
  const fromAssetName = selectedAsset.value.name
  const toAssetId = destinationAsset.value.asset_id
  const fromAssetAmountValue = fromAssetAmount.value
  const userId = userStore.user.id

  let fromAssetFullName = `${fromAssetName} (${fromAssetId})`

  $q.dialog({
    title: 'Confirm swapping',
    message: `Are you sure you want to swap ${fromAssetAmountValue} ${fromAssetFullName} 
    for the equivalent in ${toAssetId} ?`,
    cancel: true
  }).onOk(async () => {
    try {
      loading.value = true
      const fromAsset = await APIStore.getAssetById(fromAssetId, true)
      const toAsset = await APIStore.getAssetById(toAssetId, true)

      if (!fromAsset || !toAsset) throw new Error('Failed to perform the swap. One or both of the selected assets are not available.')

      const toAssetAmount = getToAssetAmount(fromAssetAmountValue, fromAsset, toAsset)

      const newFromAssetBalance = fromAssetBalance - fromAssetAmountValue

      const isFoundToAsset = digitalWallet.value.find(a => a.asset_id === toAssetId)

      if (isFoundToAsset) {
        isFoundToAsset.balance += toAssetAmount
      } else {
        digitalWallet.value.push({
          asset_id: toAssetId,
          balance: toAssetAmount,
          name: toAsset.name,
          color: getRandomColor()
        })
      }
      if (newFromAssetBalance > 0) {
        /* Update fromAsset balance */
        const isFoundFromAsset = digitalWallet.value.find(a => a.asset_id === fromAssetId)
        if (isFoundFromAsset) {
          isFoundFromAsset.balance = newFromAssetBalance
        }
      } else {
        /* Remove fromAsset object from digitalWallet */
        const index = digitalWallet.value.findIndex(a => a.asset_id === fromAssetId)
        if (index !== -1) delete digitalWallet.value[index]
        selectedAsset.value = undefined
      }

      const successUpdateDigitalWallet = await updateDigitalWallet(digitalWallet.value, userId)

      if (!successUpdateDigitalWallet) throw new Error('Failed to perform the swap.')

      /* create new transaction */
      const newTransaction = {
        type: 'swap',
        from_asset_id: fromAssetId,
        to_asset_id: toAssetId,
        from_asset_amount: fromAssetAmount.value,
        to_asset_amount: toAssetAmount
      }
      /* insert new transaction into transactions table */
      const success = await insertRows(newTransaction, Tables.Transactions)

      const message = (success) ?
        `You exchanged ${fromAssetAmount.value} ${fromAssetFullName} for ${toAssetAmount} ${toAsset.name} (${toAssetId}).
        Your new ${fromAssetFullName} balance is ${newFromAssetBalance}.`
        : 'An error has occurred during the swapping process. Please try again later.'

      $q.dialog({
        title: (success) ? 'Success' : 'Error',
        message,
        color: (success) ? 'positive' : 'negative'
      }).onOk(() => {
        if (success) fromAssetAmount.value = undefined
      })
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  })
}

const handleClick = (percentage: number) => {
  if (selectedAsset.value) {
    fromAssetAmount.value = selectedAsset.value.balance * percentage
  }
}
</script>

<template>
  <div>
    <q-form v-show="!loading" class="swap-form" @submit.prevent="handleSubmit">

      <q-select v-model="selectedAsset" outlined clearable transition-show="flip-up" transition-hide="flip-down"
        :options="DIGITAL_WALLET_OPTIONS" label="Select an asset" style="width: 200px;" />

      <q-banner dense rounded v-if="selectedAsset" class="bg-primary text-white">
        You own {{ `${selectedAsset.balance} ${selectedAsset.asset_id}` }}
      </q-banner>

      <q-input v-if="selectedAsset" type="number" v-model.number="fromAssetAmount" label="Choose an amount"
        :error="isNotValidAmount" error-message="The amount is greater than the available balance." clearable required />

      <div v-show="selectedAsset" class="centered">
        <q-btn-group>
          <q-btn v-for="p in PERCENTAGE_OPTIONS" :key="p.label" type="button" :label="p.label" color="primary"
            @click="handleClick(p.percentage)" />
        </q-btn-group>
      </div>

      <h4 v-show="selectedAsset" class="text-sm text-center">
        If you want to filter the destination asset, choose the asset type.
      </h4>
      <div v-show="selectedAsset" class="centered">
        <q-radio size="sm" v-model="selectedAssetType" :val="1" label="Crypto" />
        <q-radio size="sm" v-model="selectedAssetType" :val="0" label="Fiat" />
      </div>

      <q-select v-show="selectedAsset" v-model="destinationAsset" outlined transition-show="flip-up"
        transition-hide="flip-down" :options="DESTINATION_ASSET_OPTIONS" label="Select an destination asset"
        style="width: 200px;" :error="isSameAsset" error-message="You cannot swap an asset for itself" />

      <div v-show="selectedAsset" class="flex justify-between">
        <q-btn :disabled="isNotValidNumber || isNotValidAmount || isSameAsset" label="Swap !" type="submit"
          color="primary" />
        <q-btn type="reset" label="Reset" color="negative" />
      </div>
    </q-form>
    <div v-if="loading" class="my-20">
      <CubeLoader />
    </div>
  </div>
</template>

<style scoped>
.swap-form {
  @apply flex flex-col gap-y-5 my-20 border border-amber-500 rounded-lg p-10;
  width: 400px;
}
</style>
