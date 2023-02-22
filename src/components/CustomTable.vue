<script setup>
import { useAPIStore } from '../stores/api-store'
import { RouterLink } from 'vue-router'

const APIStore = useAPIStore()

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  assets: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="c in props.columns" :key="c">{{ c }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(asset, i) in props.assets" :key="asset.asset_id">
        <td>{{ i + 1 }}</td>
        <td><strong>{{ asset.name }}</strong> ({{ asset.asset_id }})</td>
        <td>$ {{ asset.price_usd }}</td>
        <td>$ {{ asset.volume_1day_usd }}</td>
        <td>
          <RouterLink :to="{ name: 'asset-details' }" role="button" class="p-2"
          @click="APIStore.selectedAsset = asset">
            View
          </RouterLink>
        </td>
      </tr>
    </tbody>
  </table>
</template>
