<script setup lang="ts">
import SearchPage from './pages/SearchPage.vue'

function onSearch(payload: { from: string; to: string; travelDate: string }) {
  console.info('[search]', payload)
}
</script>

<template>
  <SearchPage @search="onSearch" />
</template>
