import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAPIStore = defineStore('api-store', () => {
  const assets = ref([])
  const exchanges = ref([])

  const COINAPI_URL = 'https://rest.coinapi.io/v1/'
  const API_KEY = '96899B45-1C54-40BC-B103-A2BF272974A2'

  const CONFIG = {
    method: 'GET',
    headers: {
      'X-CoinAPI-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  }

  const ASSETS_URL = COINAPI_URL + 'assets'
  const EXCHANGES_URL = COINAPI_URL + 'exchanges'

  async function getAssetsFromAPI() {
    // fetch assets data from API
    fetch(ASSETS_URL, CONFIG)
      .then(async (response) => {
        const assetsJsonData = await response.json()
        assets.value = assetsJsonData
        console.log('Asstes lodaded from API')
      }).catch(error => {
        console.log(error)
      })
  }

  async function getExchangesFromAPI() {
    // fetch exchanges data from API
    fetch(EXCHANGES_URL, CONFIG)
      .then(async (response) => {
        const exchangesJsonData = await response.json()
        exchanges.value = exchangesJsonData
        console.log('Exchanges loaded from API')
      }).catch(error => {
        console.log(error)
      })
  }

  return {
    assets, exchanges,
    getAssetsFromAPI, getExchangesFromAPI
  }
})
