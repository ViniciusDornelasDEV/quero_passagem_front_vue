<script setup lang="ts">
import { computed } from 'vue'
import { Clock, MapPin, Circle, Armchair } from 'lucide-vue-next'
import type { Trip } from '../types/models'
import { formatDuration, formatTripTotal } from '../utils/tripFormat'

const props = defineProps<{
  trip: Trip
}>()

const logoSrc = computed(() => props.trip.company?.logo ?? '')
const companyName = computed(() => props.trip.company?.name ?? '')
const travelDuration = computed(() => props.trip.travelDuration ?? '')
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

const priceText = computed(() => formatTripTotal(props.trip))
</script>

<template>
  <article class="trip-card">
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
      <div class="duration">{{ travelDuration }}</div>
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
      <button type="button" class="btn-select">ESCOLHER IDA</button>
    </div>
  </article>
</template>