import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAPIStore = defineStore('api-store', () => {
  const assets = ref([])
  const exchanges = ref([])
  const loading = ref(false)
  const selectedAsset = ref(null)

  const COINAPI_URI = 'https://rest.coinapi.io/v1'

  const CONFIG = {
    method: "GET",
    headers: {
      "X-CoinAPI-Key": import.meta.env.VITE_COINAPI_KEY,
      "Content-Type": "application/json; charset=utf-8"
    }
  }

  const getAssetsFromAPI = () => {
    loading.value = true
    // fetch assets data from API
    fetch(`${COINAPI_URI}/assets`, CONFIG)
      .then(async (response) => {
        const assetsJsonData = await response.json()
        assets.value = assetsJsonData
        console.log('Assets lodaded from API')
      })
      .catch(error => console.log(error))
      .finally(() => loading.value = false)
  }

  const getExchangesFromAPI = () => {
    loading.value = true
    // fetch exchanges data from API
    fetch(`${COINAPI_URI}/exchanges`, CONFIG)
      .then(async (response) => {
        const exchangesJsonData = await response.json()
        exchanges.value = exchangesJsonData
        console.log('Exchanges loaded from API')
      })
      .catch(error => console.log(error))
      .finally(() => loading.value = false)
  }

  const getAssetById = async (assetId) => {
    try {
      const response = await fetch(`${COINAPI_URI}/assets/${assetId}`, CONFIG)
      const jsonAsset = await response.json()
      return jsonAsset
    } catch (error) {
      console.error(`Error fetching asset ${assetId}: ${error}`)
      return null
    }
  }

  return {
    assets, exchanges, loading, selectedAsset,
    getAssetsFromAPI, getExchangesFromAPI,
    getAssetById
  }
})
