import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Asset = {
  name: string;
  type_is_crypto: 0 | 1;
  asset_id: string;
  iconUrl: string | null;
  price_usd: number;
  volume_1hrs_usd: number;
  volume_1day_usd: number;
  volume_1mth_usd: number;
}

type Icon = {
  asset_id: string;
  url: string;
}

type Exchange = {

}

export const useAPIStore = defineStore('api-store', () => {
  const assets = ref<Asset[]>([])
  const exchanges = ref<Exchange[]>([])
  const loading = ref(false)
  const assetIcons = ref<Icon[]>([])
  const lastUpdate = ref<Date>()

  const COINAPI_URI = 'https://rest.coinapi.io/v1'
  const SECONDS_TO_MILLISECONDS = 1000

  const CONFIG = {
    method: "GET",
    headers: {
      "X-CoinAPI-Key": import.meta.env.VITE_COINAPI_KEY,
      "Content-Type": "application/json; charset=utf-8"
    }
  }

  const getAssetIcons = async (size = 32) => {
    try {
      const res = await fetch(`${COINAPI_URI}/assets/icons/${size}`, CONFIG)
      const jsonAssetIcons = await res.json()
      return jsonAssetIcons
    } catch (error) {
      console.error(`Error fetching asset icons: ${error}`)
      return null
    }
  }

  /**
   * This function fetches assets data from CoinAPI.
   * @param {number} updateIntervalSeconds - The time interval (in seconds) before allowing an update.
   */
  const getAssetsFromAPI = async (updateIntervalSeconds: number = 60) => {
    let isUpdateAllowed = true /* Allow update by default */

    if (lastUpdate.value) {
      const currentDate = new Date()
      const elapsedTime = currentDate.getTime() - lastUpdate.value.getTime()
      isUpdateAllowed = elapsedTime > updateIntervalSeconds * SECONDS_TO_MILLISECONDS
    }

    if (isUpdateAllowed) {
      try {
        loading.value = true
        const res = await fetch(`${COINAPI_URI}/assets`, CONFIG)
        const assetsJsonData = await res.json()

        if (assetsJsonData) {
          assets.value = assetsJsonData
          lastUpdate.value = new Date()
        }

        if (!assetIcons.value) {
          const assetIconsJson = await getAssetIcons()
          if (assetIconsJson)
            assetIcons.value = assetIconsJson
        }
      } catch (err) {
        console.error(err)
      } finally {
        loading.value = false
      }
    }
  }

  const getExchangesFromAPI = async () => {
    try {
      loading.value = true
      const res = await fetch(`${COINAPI_URI}/exchanges`, CONFIG)
      const exchangesJsonData = await res.json()

      if (exchangesJsonData) {
        exchanges.value = exchangesJsonData
      }
    } catch (err) {
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const getAssetById = async (assetId: string) => {
    try {
      const res = await fetch(`${COINAPI_URI}/assets/${assetId}`, CONFIG)
      const jsonAsset = await res.json()
      return jsonAsset[0]
    } catch (error) {
      console.error(`Error fetching asset ${assetId}: ${error}`)
      return null
    }
  }

  return {
    assets, exchanges, loading, lastUpdate,
    getAssetsFromAPI, getExchangesFromAPI,
    getAssetById, assetIcons
  }
})
