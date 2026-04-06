<script setup lang="ts">
import { computed } from 'vue'
import type { SeatMatrixItem } from '../types/models'

const props = defineProps<{
  seats: SeatMatrixItem[]
}>()

const maxX = computed(() =>
  props.seats.length ? Math.max(...props.seats.map((s) => s.position.x)) : 0,
)
const maxY = computed(() =>
  props.seats.length ? Math.max(...props.seats.map((s) => s.position.y)) : 0,
)
</script>

<template>
  <div class="busWrapper">
    <div
      class="busLayout"
      :style="{ gridTemplateColumns: `repeat(${maxX + 1}, 40px)` }"
    >
      <div
        v-for="seat in seats"
        :key="`${seat.position.x}-${seat.position.y}`"
        class="seat"
        :class="{
          occupied: seat.occupied,
          empty: seat.type !== 'seat',
        }"
        :style="{
          gridArea: `${maxY - seat.position.y + 1} / ${seat.position.x + 1} / ${
            maxY - seat.position.y + 2
          } / ${seat.position.x + 2}`
        }"
      >
        <span v-if="seat.type === 'seat'">
          {{ seat.occupied ? 'X' : seat.seat_number }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.busWrapper {
  overflow-x: auto;
}

.busLayout {
  display: grid;
  gap: 8px;
  justify-content: start;
}

.seat {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  aspect-ratio: 1 / 1;
  border: 1px solid #2563eb;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  color: #1d4ed8;
  background: #eff6ff;
}

.seat.occupied {
  border: 1px solid #d1d5db;
  color: #9ca3af;
  background: #f9fafb;
  cursor: not-allowed;
}

.seat.empty {
  border: none;
  background: transparent;
  pointer-events: none;
}
</style>
