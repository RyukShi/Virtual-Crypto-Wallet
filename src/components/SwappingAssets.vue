<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getRandomColor } from '../utils'
import CubeLoader from './CubeLoader.vue'
import { useUserStore, type DigitalCurrency, type DigitalWallet, type Transaction } from '@/stores/user-store'
import { useAPIStore } from '@/stores/api-store'
import { getToAssetAmount } from '@/common/crypto-utils'

const userStore = useUserStore()
const APIStore = useAPIStore()
const route = useRoute()

const selectedAsset = ref<DigitalCurrency>()
const fromAssetAmount = ref<number>()
const destinationAssetId = ref<string>()
const selectedAssetType = ref<number>()
const loading = ref(false)
const digitalWallet = ref<DigitalWallet>([]);
const transactions = ref<Transaction[]>([]);

onBeforeMount(() => {
  let { assetId, assetType } = route.query
  destinationAssetId.value = (assetId !== undefined) ? assetId as string : ''

  selectedAssetType.value = Number.parseInt(assetType as string)

  if (userStore.user?.user_metadata) {
    digitalWallet.value = userStore.user.user_metadata.digitalWallet
    transactions.value = userStore.user.user_metadata.transactions
  }
})

const getFilteredAssets = computed(() => {
  return APIStore.getFilteredAssets.filter(asset =>
    asset.type_is_crypto === selectedAssetType.value)
})
const isNotCompleteForm = computed(() =>
  !selectedAsset.value || !fromAssetAmount.value || !destinationAssetId.value
)
const isNotValidNumber = computed(() => !!fromAssetAmount.value && isNaN(fromAssetAmount.value))
const isNotValidAmount = computed(() => {
  if (fromAssetAmount.value && selectedAsset.value)
    return fromAssetAmount.value > selectedAsset.value.balance
  else return false
})
const isSameAsset = computed(() => {
  return !!selectedAsset.value && !!destinationAssetId.value &&
    selectedAsset.value.asset_id === destinationAssetId.value
})

const PERCENTAGE_OPTIONS = [
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: 'All' }
]

const confirmSwapping = (fromAssetFullName: string, toAssetId: string) => {
  return confirm(
    `Are you sure you want to swap ${fromAssetAmount.value?.toFixed(4)} ${fromAssetFullName} 
    for the equivalent in ${toAssetId} ?`)
}

const handleSubmit = async () => {
  if (!selectedAsset.value || !destinationAssetId.value || !fromAssetAmount.value) return

  const fromAssetId = selectedAsset.value.asset_id
  const fromAssetBalance = selectedAsset.value.balance
  const fromAssetName = selectedAsset.value.name
  const toAssetId = destinationAssetId.value

  let fromAssetFullName = `${fromAssetName} (${fromAssetId})`

  if (confirmSwapping(fromAssetFullName, toAssetId)) {
    try {
      loading.value = true
      const fromAsset = await APIStore.getAssetById(fromAssetId, true)
      const toAsset = await APIStore.getAssetById(toAssetId, true)

      /* TODO handle this error */
      if (!fromAsset || !toAsset) return

      const toAssetAmount = getToAssetAmount(fromAssetAmount.value, fromAsset, toAsset)

      const newFromAssetBalance = fromAssetBalance - fromAssetAmount.value

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
        if (index !== -1) digitalWallet.value.splice(index, 1)
        selectedAsset.value = undefined
      }
      /* Update digitalWallet */
      await userStore.updateDigitalWallet(digitalWallet.value)
      /* Update transactions */
      transactions.value.push({
        date: new Date().toLocaleString(),
        type: 'swap',
        from_asset_id: fromAssetId,
        to_asset_id: toAssetId,
        from_asset_amount: fromAssetAmount.value,
        to_asset_amount: toAssetAmount
      })
      await userStore.updateTransactions(transactions.value)
      /* Display alert for user */
      alert(`You exchanged ${fromAssetAmount.value.toFixed(4)} ${fromAssetFullName} for ${toAssetAmount.toFixed(4)} ${toAsset.name} (${toAssetId}). Your new ${fromAssetFullName} balance is ${newFromAssetBalance.toFixed(4)}.`)
      /* Reset amount input */
      fromAssetAmount.value = undefined
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }
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

      <h3 class="text-sm text-center">Choose the asset type to filter</h3>
      <div class="centered">
        <q-radio size="sm" v-model="selectedAssetType" :val="1" label="Crypto" />
        <q-radio size="sm" v-model="selectedAssetType" :val="0" label="Fiat" />
      </div>

      <div v-if="isSameAsset">
        <p class="error-message">You cannot swap an asset for itself</p>
      </div>

      <select v-model="selectedAsset" required>
        <option :value="null">Choose an asset to swap</option>
        <option v-for="asset in digitalWallet" :key="asset.asset_id" :value="asset">
          {{ `${asset.name} (${asset.asset_id})` }}
        </option>
      </select>

      <div v-if="selectedAsset">
        <p>You own {{ `${selectedAsset.balance} ${selectedAsset.asset_id}` }}</p>
      </div>

      <div>
        <q-input v-show="selectedAsset" type="number" v-model.number="fromAssetAmount" label="Choose an amount"
          required />
        <p v-if="isNotValidAmount" class="error-message">
          The amount is greater than the available balance
        </p>
      </div>

      <div v-show="selectedAsset" class="flex justify-between">
        <q-btn-group>
          <q-btn v-for="p in PERCENTAGE_OPTIONS" :key="p.label" type="button" :label="p.label" color="accent"
            @click="handleClick(p.value)" />
        </q-btn-group>
      </div>

      <select v-show="selectedAsset" v-model="destinationAssetId" required>
        <option :value="null">Choose an destination asset</option>
        <option v-for="asset in getFilteredAssets" :key="asset.asset_id" :value="asset.asset_id">
          {{ `${asset.name} (${asset.asset_id})` }}
        </option>
      </select>

      <div class="flex justify-between">
        <q-btn :disabled="isNotCompleteForm || isNotValidNumber || isNotValidAmount || isSameAsset" label="Swap !"
          type="submit" color="primary" />
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
  @apply flex flex-col gap-y-5 my-20 border-2 border-amber-500 rounded-lg p-10;
}
</style>
