import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type PeriodsVolume = {
  volume_1hrs_usd: number;
  volume_1day_usd: number;
  volume_1mth_usd: number;
}

export type Asset = {
  name: string;
  type_is_crypto: 0 | 1;
  asset_id: string;
  icon_url?: string;
  price_usd: number;
} & PeriodsVolume

type Icon = {
  asset_id: string;
  url: string;
}

type Exchange = {
  name: string;
  exchange_id: string;
  website: string;
} & PeriodsVolume

export const useAPIStore = defineStore('api-store', () => {
  const assets = ref<Asset[]>([])
  const exchanges = ref<Exchange[]>([])
  const loading = ref(false)
  const assetIcons = ref<Icon[]>([])
  const lastUpdate = ref<Date>()

  const COINAPI_URI = 'https://rest.coinapi.io/v1'
  /* The time interval before allowing an update. (60 seconds for production mode and 5 minutes for dev mode)  */
  const UPDATE_INTERVAL = (import.meta.env.PROD) ? 60000 : 300000

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
      return jsonAssetIcons as Icon[]
    } catch (error) {
      console.error(`Error fetching asset icons: ${error}`)
    }
  }

  const shouldPerformUpdate = (): boolean => {
    if (!lastUpdate.value) return true
    const currentDate = new Date()
    const elapsedTime = currentDate.getTime() - lastUpdate.value.getTime()
    return (elapsedTime > UPDATE_INTERVAL)
  }

  /**
   * This function fetches assets data from CoinAPI.
   */
  const getAssetsFromAPI = async () => {
    if (shouldPerformUpdate()) {
      try {
        loading.value = true
        const res = await fetch(`${COINAPI_URI}/assets`, CONFIG)
        const assetsJsonData = await res.json()

        if (assetsJsonData) {
          assets.value = assetsJsonData
          lastUpdate.value = new Date()
        }

        if (assetIcons.value.length === 0) {
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

  const getAssetById = async (assetId: string, performUpdate: boolean = false) => {
    if (performUpdate || shouldPerformUpdate()) {
      try {
        loading.value = true
        const res = await fetch(`${COINAPI_URI}/assets/${assetId}`, CONFIG)
        const jsonAsset = await res.json()

        if (!jsonAsset) throw new Error('Json data is not valid')

        const icon = assetIcons.value.find(icon => icon.asset_id === jsonAsset[0].asset_id)
        return { ...jsonAsset[0], icon_url: (icon) ? icon.url : undefined } as Asset
      } catch (error) {
        console.error(`Error fetching asset ${assetId}: ${error}`)
      } finally {
        loading.value = false
      }
    } else {
      return getFilteredAssets.value.find(asset => asset.asset_id === assetId)
    }
  }

  const getFilteredAssets = computed(() => {
    // filtering assets for faster rendering
    return assets.value.filter(asset =>
      !isNaN(asset.price_usd) && asset.price_usd > 0 &&
      asset.volume_1day_usd > Math.pow(10, 7)
    ).map(asset => {
      const icon = assetIcons.value.find(icon => icon.asset_id === asset.asset_id)
      /* Add iconUrl property into object */
      return { ...asset, icon_url: (icon) ? icon.url : undefined }
    })
  })

  return {
    assets, exchanges, loading, lastUpdate,
    getAssetsFromAPI, getExchangesFromAPI,
    getAssetById, getFilteredAssets
  }
})
