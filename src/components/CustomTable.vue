<script setup lang="ts">
import { type Asset } from '@/stores/api-store'

export type CustomTableProps = {
  columns: any[];
  rows: Asset[];
}

const props = defineProps<CustomTableProps>()
</script>

<template>
  <q-table flat bordered title="Assets" color="amber" :rows="props.rows" :columns="props.columns"
    :pagination="{ rowsPerPage: 25 }" />
</template>
