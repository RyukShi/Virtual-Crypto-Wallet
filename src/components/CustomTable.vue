<script setup lang="ts">
import { type Asset } from '@/stores/api-store'

type CustomTableProps = {
  columns: any[];
  rows: Asset[];
  title: string;
}

const props = defineProps<CustomTableProps>()
</script>

<template>
  <q-table flat bordered :title="props.title" color="amber" :rows="props.rows" :columns="props.columns"
    :pagination="{ rowsPerPage: 25 }" />
</template>
