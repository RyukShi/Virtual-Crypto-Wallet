<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { formattedNumber } from '../utils'
import { type Asset } from '@/stores/api-store'

export type CustomTableProps = {
  columns: string[];
  assets: Asset[];
}

const props = defineProps<CustomTableProps>()
</script>

<template>
  <div class="container">
    <table class="custom-table">
      <thead>
        <tr>
          <th class="custom-cell" v-for="c in props.columns" :key="c">{{ c }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(asset, i) in props.assets" :key="asset.asset_id">
          <td class="custom-cell">{{ i + 1 }}</td>
          <td class="custom-cell">
            <div class="centered gap-x-4">
              {{ asset.asset_id }}
              <img v-if="asset.iconUrl" :src="asset.iconUrl" :alt="`${asset.asset_id} icon`" />
            </div>
          </td>
          <td class="custom-cell">{{ formattedNumber(asset.price_usd) }}</td>
          <td class="custom-cell">{{ formattedNumber(asset.volume_1day_usd) }}</td>
          <td class="custom-cell">
            <RouterLink :to="{ name: 'asset-details', params: { assetId: asset.asset_id } }" role="button" class="btn btn-sky">
              View
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.custom-table {
  @apply border-collapse border-2 border-slate-50 w-full text-center bg-sky-900;
}

.custom-cell {
  @apply p-4;
}
</style>
