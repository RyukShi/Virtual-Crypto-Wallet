<script setup>
import { ref, inject, computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { getRandomColor } from '../utils'

const userStore = inject('userStore')
const APIStore = inject('APIStore')
const route = useRoute()

const { isCrypto, assetId } = route.query
const { digitalWallet } = userStore.user.user_metadata

const selectedAsset = ref(null)
const amount = ref(null)
const destinationAssetId = ref(null)
const loading = ref(false)

onBeforeMount(() => {
  destinationAssetId.value = (assetId !== undefined) ? assetId : null
})

const getFilteredAsset = computed(() => {
  return APIStore.assets.filter(asset =>
    asset.type_is_crypto === Number(isCrypto) &&
    !isNaN(asset.price_usd) && asset.price_usd > 0 &&
    asset.volume_1day_usd > Math.pow(10, 7)
  )
})
const isNotCompleteForm = computed(() =>
  !selectedAsset.value || !amount.value || !destinationAssetId.value
)
const isNotValidNumber = computed(() => amount.value && isNaN(amount.value))
const isNotValidAmount = computed(() => {
  if (amount.value && selectedAsset.value)
    return parseFloat(amount.value) > selectedAsset.value.balance
  else return false
})
const isSameAsset = computed(() => {
  return selectedAsset.value && destinationAssetId.value &&
    selectedAsset.value.asset_id === destinationAssetId.value
})

const PERCENTAGE_OPTIONS = [
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 1, label: 'All' }
]

const handleSubmit = async () => {
  const { asset_id: fromAssetId, balance: fromAssetBalance } = selectedAsset.value
  const toAssetId = destinationAssetId.value
  const fromAssetAmount = parseFloat(amount.value)
  if (confirm(`Are you sure you want to swap ${fromAssetAmount.toFixed(4)} ${fromAssetId} for the equivalent in ${toAssetId} ?`)) {
    try {
      loading.value = true
      const [{ price_usd: fromAssetPrice }] = await APIStore.getAssetById(fromAssetId)
      const [{ price_usd: toAssetPrice }] = await APIStore.getAssetById(toAssetId)
      /* Calcul du montant de l'actif d'arrivée */
      const toAssetAmount = (fromAssetAmount * fromAssetPrice) / toAssetPrice
      /* Calcul de la nouvelle balance */
      const newFromAssetBalance = fromAssetBalance - fromAssetAmount
      /* Vérification de la présence de toAsset */
      const toAsset = digitalWallet.find(a => a.asset_id === toAssetId)

      if (toAsset) {
        toAsset.balance += toAssetAmount
      } else {
        digitalWallet.push({
          asset_id: toAssetId,
          balance: toAssetAmount,
          color: getRandomColor()
        })
      }
      /* Update fromAsset balance */
      digitalWallet.find(a => a.asset_id === fromAssetId).balance = newFromAssetBalance
      /* Update digitalWallet */
      userStore.updateDigitalWallet(digitalWallet)
      /* Display alert for user */
      alert(`You exchanged ${fromAssetAmount.toFixed(4)} ${fromAssetId} for ${toAssetAmount.toFixed(4)} ${toAssetId}. Your new ${fromAssetId} balance is ${newFromAssetBalance.toFixed(4)}.`)
      /* Reset amount input */
      amount.value = null
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = true
    }
  }
}

const handleClick = (percentage) => {
  amount.value = selectedAsset.value.balance * percentage
}
</script>

<template>
  <div>
    <form class="swap-form" @submit.prevent="handleSubmit">
      <div v-if="isSameAsset">
        <p class="error-message">You cannot swap an asset for itself</p>
      </div>

      <select v-model="selectedAsset" required>
        <option :value="null">Choose an asset to swap</option>
        <option v-for="asset in digitalWallet"
          :key="asset.asset_id"
          :value="asset">
          {{ asset.asset_id }}
        </option>
      </select>

      <div v-if="selectedAsset">
        <p>You own {{ `${selectedAsset.balance} ${selectedAsset.asset_id}` }}</p>
      </div>

      <div>
        <input v-show="selectedAsset" type="text" v-model="amount"
        placeholder="Please choose an amount" required />
        <p v-if="isNotValidNumber" class="error-message">Please enter a valid number</p>
        <p v-else-if="isNotValidAmount" class="error-message">
          The amount is greater than the available balance
        </p>
      </div>

      <div v-show="selectedAsset" class="flex justify-between">
        <button v-for="p in PERCENTAGE_OPTIONS"
          :key="p.value"
          type="button"
          class="btn btn-sky"
          @click="handleClick(p.value)">
          {{ p.label }}
        </button>
      </div>

      <select v-show="selectedAsset" v-model="destinationAssetId" required>
        <option :value="null">Choose an destination asset</option>
        <option v-for="asset in getFilteredAsset"
          :key="asset.asset_id"
          :value="asset.asset_id">
          {{ `${asset.name} (${asset.asset_id})` }}
        </option>
      </select>
      
      <div class="flex justify-between">
        <button
          :disabled="isNotCompleteForm || isNotValidNumber || isNotValidAmount || isSameAsset"
          class="btn btn-sky"
          type="submit">
          Swap !
        </button>
        <button class="btn btn-rose" type="reset">Reset</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.swap-form {
  @apply flex flex-col gap-y-5 my-20 border-2
  border-amber-500 rounded-lg p-10;
}
</style>
