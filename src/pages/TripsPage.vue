<script setup>
import { computed, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useTripStore } from '../stores/tripStore'
import TripCard from '../components/TripCard.vue'

const route = useRoute()
const tripStore = useTripStore()
const { trips, loading, error } = storeToRefs(tripStore)

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
  (params) => {
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

      <ul v-else class="trips-page__list" aria-label="Lista de viagens">
        <li v-for="(trip, index) in trips" :key="trip.id ?? index" class="trips-page__item">
          <TripCard :trip="trip" />
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.trips-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px 48px;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f8fafc;
}

.trips-page__header {
  margin-bottom: 24px;
}

.trips-page__back {
  display: inline-block;
  margin-bottom: 12px;
  font-size: 14px;
  color: #2f66b3;
  text-decoration: none;
}

.trips-page__back:hover {
  text-decoration: underline;
}

.trips-page__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.trips-page__state {
  margin: 0;
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: #475569;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.trips-page__state--error {
  color: #991b1b;
  background: #fef2f2;
  border-color: #fecaca;
}

.trips-page__state--warn {
  text-align: center;
}

.trips-page__link {
  display: inline-block;
  margin-top: 12px;
  color: #2f66b3;
  font-weight: 600;
}

.trips-page__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trips-page__item {
  margin: 0;
}
</style>
