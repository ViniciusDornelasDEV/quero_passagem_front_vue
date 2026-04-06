<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, MapPin, Circle, Armchair } from 'lucide-vue-next'
import type { SeatMatrixItem, Trip } from '../types/models'
import { fetchSeatMatrix } from '../services/seatService'
import { formatDuration, formatTripTotal } from '../utils/tripFormat'
import SeatGrid from './SeatGrid.vue'

const props = defineProps<{
  trip: Trip
}>()

const logoSrc = computed(() => props.trip.company?.logo ?? '')
const companyName = computed(() => props.trip.company?.name ?? '')
const departureTime = computed(() => props.trip.departure?.time ?? '—')
const arrivalTime = computed(() => props.trip.arrival?.time ?? '—')

const originName = computed(
  () => props.trip.from?.name ?? props.trip.origin?.name ?? '—',
)
const destinationName = computed(
  () => props.trip.to?.name ?? props.trip.destination?.name ?? '—',
)

const seatLabel = computed(
  () => props.trip.seatClass ?? props.trip.class ?? '—',
)

const durationText = computed(() => formatDuration(props.trip))
const priceText = computed(() => formatTripTotal(props.trip))

const showSeats = ref(false)
const seats = ref<SeatMatrixItem[]>([])
const loadingSeats = ref(false)
const seatsError = ref<string | null>(null)

function toSeatList(payload: any): SeatMatrixItem[] {
  return Array.isArray(payload?.data) ? payload.data : []
}

async function loadSeats(): Promise<void> {
  if (!props.trip.id || loadingSeats.value) return

  loadingSeats.value = true
  seatsError.value = null
  try {
    const data = await fetchSeatMatrix(props.trip.id)
    seats.value = toSeatList(data)
  } catch {
    seatsError.value = 'Não foi possível carregar os assentos.'
  } finally {
    loadingSeats.value = false
  }
}

async function toggleSeats(): Promise<void> {
  showSeats.value = !showSeats.value
  if (showSeats.value && seats.value.length === 0) {
    await loadSeats()
  }
}
</script>

<template>
  <article class="trip-card-wrapper">
    <div class="trip-card">
      <div class="trip-card__logo">
        <img
          v-if="logoSrc"
          :src="logoSrc"
          :alt="companyName || 'Logo'"
          class="trip-card__logo-img"
          loading="lazy"
        />
        <div v-else class="trip-card__logo-fallback" aria-hidden="true">
          {{ (companyName || '?').slice(0, 1).toUpperCase() }}
        </div>
        <span v-if="companyName" class="trip-card__company">{{ companyName }}</span>
      </div>

      <div class="trip-card__times-col">
        <div class="trip-times">
          <Clock class="icon" :size="16" :stroke-width="2" aria-hidden="true" />
          <strong>{{ departureTime }}</strong>
          <span class="arrow" aria-hidden="true">→</span>
          <span>{{ arrivalTime }}</span>
        </div>
        <div class="duration">{{ durationText }}</div>
      </div>

      <div class="trip-places">
        <div class="place">
          <Circle class="icon" :size="16" :stroke-width="2" aria-hidden="true" />
          <span>{{ originName }}</span>
        </div>
        <div class="place">
          <MapPin class="icon" :size="16" :stroke-width="2" aria-hidden="true" />
          <span>{{ destinationName }}</span>
        </div>
      </div>

      <div class="trip-seat">
        <Armchair class="icon" :size="16" :stroke-width="2" aria-hidden="true" />
        <span>{{ seatLabel }}</span>
      </div>

      <div class="trip-card__right">
        <div class="trip-price">
          <strong>{{ priceText }}</strong>
          <span class="trip-price__hint">por pessoa</span>
        </div>
        <button type="button" class="btn-select" @click="toggleSeats">
          {{ showSeats ? 'OCULTAR ASSENTOS' : 'ESCOLHER IDA' }}
        </button>
      </div>
    </div>

    <div v-if="showSeats" class="trip-card__seats">
      <p v-if="loadingSeats" class="trip-card__seats-state">Carregando assentos...</p>
      <p v-else-if="seatsError" class="trip-card__seats-error">{{ seatsError }}</p>
      <p v-else-if="seats.length === 0" class="trip-card__seats-state">
        Nenhum assento disponível para este trecho.
      </p>
      <SeatGrid v-else :seats="seats" />
    </div>
  </article>
</template>