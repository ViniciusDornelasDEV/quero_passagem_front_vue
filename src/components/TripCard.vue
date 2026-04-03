<script setup lang="ts">
import { computed } from 'vue'
import type { Trip, TripDuration } from '../types/models'

const props = defineProps<{
  trip: Trip
}>()

const logoSrc = computed(() => props.trip.company?.logo ?? '')
const companyName = computed(() => props.trip.company?.name ?? '')

const departureTime = computed(() => props.trip.departure?.time ?? '—')
const arrivalTime = computed(() => props.trip.arrival?.time ?? '—')

const originName = computed(() => props.trip.origin?.name ?? '—')
const destinationName = computed(() => props.trip.destination?.name ?? '—')

function formatDuration(d: TripDuration | undefined): string {
  if (d == null || d === '') return '—'
  if (typeof d === 'string' || typeof d === 'number') return String(d)
  const h = d.hours ?? d.h
  const m = d.minutes ?? d.m
  if (h != null || m != null) {
    const parts: string[] = []
    if (h != null) parts.push(`${h}h`)
    if (m != null) parts.push(`${m}min`)
    return parts.join(' ') || '—'
  }
  return '—'
}

const durationLabel = computed(() => formatDuration(props.trip.duration))

const travelClass = computed(() => props.trip.class ?? '—')

const priceRaw = computed(() => {
  const p = props.trip.price
  if (p == null || p === '') return null
  const n = typeof p === 'number' ? p : Number(String(p).replace(',', '.'))
  return Number.isFinite(n) ? n : null
})
</script>

<template>
  <div class="cardResultado">
    <img
      v-if="logoSrc"
      :src="logoSrc"
      :alt="companyName || 'Logo da empresa'"
      class="cardResultado__img"
      loading="lazy"
    />

    <div>
      <strong>{{ departureTime }}</strong>
      →
      {{ arrivalTime }}
    </div>

    <div>
      {{ originName }}
      →
      {{ destinationName }}
    </div>

    <div>{{ durationLabel }}</div>

    <div>{{ travelClass }}</div>

    <div>
      <template v-if="priceRaw != null">
        {{
          priceRaw.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        }}
      </template>
      <template v-else>R$ {{ trip.price ?? '—' }}</template>
    </div>

    <button type="button" class="cardResultado__btn">Escolher ida</button>
  </div>
</template>

<style scoped>
.cardResultado {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  font-size: 14px;
  color: #334155;
}

.cardResultado__img {
  max-width: 100px;
  max-height: 48px;
  width: auto;
  height: auto;
  object-fit: contain;
  margin-bottom: 4px;
}

.cardResultado strong {
  color: #0f172a;
  font-weight: 700;
}

.cardResultado__btn {
  align-self: flex-start;
  margin-top: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background: #2f66b3;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.cardResultado__btn:hover {
  filter: brightness(1.08);
}
</style>
