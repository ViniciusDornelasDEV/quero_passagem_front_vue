<script setup lang="ts">
import type { Trip } from '../types/models'
import TripCard from './TripCard.vue'

defineProps<{
  trips: Trip[]
}>()
</script>

<template>
  <div class="trips-list" role="list" aria-label="Lista de viagens">
    <TripCard
      v-for="(trip, index) in trips"
      :key="trip.id ?? index"
      :trip="trip"
      class="trips-list__item"
    />
  </div>
</template>