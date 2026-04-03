import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import api from '../services/api'
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
        const response = await api.post<unknown>('/search', payload)
        this.trips = tripsFromResponse(response.data)
      } catch (e: unknown) {
        let msg: string | undefined
        if (isAxiosError(e)) {
          const d = e.response?.data as { error?: { message?: string } } | undefined
          msg =
            typeof d?.error?.message === 'string' ? d.error.message : undefined
        }
        this.error = msg ?? 'Erro ao buscar viagens'
        this.trips = []
      } finally {
        this.loading = false
      }
    },
  },
})
