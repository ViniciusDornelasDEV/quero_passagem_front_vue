<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTripStore } from '../stores/tripStore'
import type { SearchTripsPayload, Trip } from '../types/models'
import TripsList from '../components/TripsList.vue'

const route = useRoute()
const tripStore = useTripStore()
const { loading, error } = storeToRefs(tripStore)
const trips = computed((): Trip[] => tripStore.trips as Trip[])

const from = computed(() => route.query.from)
const to = computed(() => route.query.to)
const date = computed(() => route.query.date)

const searchParams = computed(() => {
  if (!from.value || !to.value || !date.value) return null
  return {
    from: String(from.value),
    to: String(to.value),
    travelDate: String(date.value),
  }
})

const showEmpty = computed(
  () =>
    !loading.value &&
    !error.value &&
    searchParams.value &&
    trips.value.length === 0,
)

watch(
  searchParams,
  (params: SearchTripsPayload | null) => {
    if (params) {
      tripStore.searchTrips(params)
    } else {
      tripStore.$patch({ trips: [], error: null, loading: false })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="trips-page">
    <header class="trips-page__header">
      <RouterLink to="/" class="trips-page__back">← Nova busca</RouterLink>
      <h1 class="trips-page__title">Resultados da busca</h1>
    </header>

    <div v-if="!searchParams" class="trips-page__state trips-page__state--warn">
      <p>Parâmetros de busca ausentes.</p>
      <RouterLink to="/" class="trips-page__link">Voltar para a busca</RouterLink>
    </div>

    <template v-else>
      <p v-if="loading" class="trips-page__state">Buscando viagens…</p>

      <p v-else-if="error" class="trips-page__state trips-page__state--error" role="alert">
        {{ error }}
      </p>

      <p v-else-if="showEmpty" class="trips-page__state">Nenhuma viagem encontrada</p>

      <TripsList v-else :trips="trips" class="trips-page__results" />
    </template>
  </div>
</template>