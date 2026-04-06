import { defineStore } from 'pinia'
import { searchTrips } from '../services/tripService'
import type { SearchTripsPayload, Trip } from '../types/models'

interface TripState {
  trips: Trip[]
  loading: boolean
  error: string | null
}

function tripsFromResponse(data: unknown): Trip[] {
  if (Array.isArray(data)) {
    return data as Trip[]
  }
  if (typeof data === 'object' && data !== null && 'data' in data) {
    const inner = (data as { data: unknown }).data
    if (Array.isArray(inner)) {
      return inner as Trip[]
    }
  }
  return []
}

export const useTripStore = defineStore('trip', {
  state: (): TripState => ({
    trips: [],
    loading: false,
    error: null,
  }),

  actions: {
    async searchTrips(payload: SearchTripsPayload): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const data = await searchTrips(payload)
        this.trips = tripsFromResponse(data)
      } catch (e: unknown) {
        this.error = 'Erro ao buscar viagens'
        this.trips = []
      } finally {
        this.loading = false
      }
    },
  },
})
