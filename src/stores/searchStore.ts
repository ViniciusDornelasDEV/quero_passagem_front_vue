import { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { getStops } from '../services/stopsService'
import type { SearchTripsPayload, Stop } from '../types/models'

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function filterStops(stops: Stop[], query: string): Stop[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return stops.slice(0, 50)
  }
  return stops.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50)
}

interface SearchState {
  stops: Stop[]
  originInput: string
  destinationInput: string
  selectedOrigin: Stop | null
  selectedDestination: Stop | null
  travelDate: string
  loadError: string | null
  loadingStops: boolean
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    stops: [],
    originInput: '',
    destinationInput: '',
    selectedOrigin: null,
    selectedDestination: null,
    travelDate: todayISO(),
    loadError: null,
    loadingStops: false,
  }),

  getters: {
    filteredOrigins(state): Stop[] {
      return filterStops(state.stops, state.originInput)
    },
    filteredDestinations(state): Stop[] {
      return filterStops(state.stops, state.destinationInput)
    },
    canSearch(state): boolean {
      return Boolean(
        state.selectedOrigin?.id &&
          state.selectedDestination?.id &&
          state.travelDate &&
          state.selectedOrigin.id !== state.selectedDestination.id,
      )
    },
    minTravelDate(): string {
      return todayISO()
    },
  },

  actions: {
    async fetchStops(): Promise<void> {
      this.loadError = null
      this.loadingStops = true
      try {
        this.stops = await getStops()
      } catch (e: unknown) {
        let msg: string | undefined
        if (isAxiosError(e)) {
          const d = e.response?.data as { message?: string } | undefined
          msg = typeof d?.message === 'string' ? d.message : undefined
        } else if (e instanceof Error) {
          msg = e.message
        }
        this.loadError = msg ?? 'Não foi possível carregar os destinos.'
      } finally {
        this.loadingStops = false
      }
    },

    setOrigin(input: string): void {
      this.originInput = input
      if (this.selectedOrigin && input !== this.selectedOrigin.name) {
        this.selectedOrigin = null
      }
    },

    setDestination(input: string): void {
      this.destinationInput = input
      if (this.selectedDestination && input !== this.selectedDestination.name) {
        this.selectedDestination = null
      }
    },

    selectOrigin(stop: Stop): void {
      this.selectedOrigin = { id: stop.id, name: stop.name }
      this.originInput = stop.name
    },

    selectDestination(stop: Stop): void {
      this.selectedDestination = { id: stop.id, name: stop.name }
      this.destinationInput = stop.name
    },

    search(): SearchTripsPayload | null {
      if (!this.canSearch || !this.selectedOrigin || !this.selectedDestination) {
        return null
      }
      return {
        from: this.selectedOrigin.id,
        to: this.selectedDestination.id,
        travelDate: this.travelDate,
      }
    },
  },
})
