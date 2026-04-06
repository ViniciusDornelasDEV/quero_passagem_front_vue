import { defineStore } from 'pinia'
import { getStops } from '../services/stopsService'
import type {
  FlattenedStop,
  SearchTripsPayload,
  Stop,
} from '../types/models'

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isStopAllowed(stop: Stop, allowedStates: string[]): boolean {
  if (typeof stop.allowed === 'boolean') {
    return stop.allowed
  }
  if (allowedStates.length === 0) {
    return true
  }
  return Boolean(stop.state && allowedStates.includes(stop.state))
}

function filterStops(stops: FlattenedStop[], query: string): FlattenedStop[] {
  const q = query.trim().toLowerCase()
  if (!q) {
    return stops.slice(0, 50)
  }
  return stops.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50)
}

interface SearchState {
  stops: Stop[]
  allowedStates: string[]
  originInput: string
  destinationInput: string
  selectedOrigin: FlattenedStop | null
  selectedDestination: FlattenedStop | null
  travelDate: string
  loadError: string | null
  loadingStops: boolean
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    stops: [],
    allowedStates: [],
    originInput: '',
    destinationInput: '',
    selectedOrigin: null,
    selectedDestination: null,
    travelDate: todayISO(),
    loadError: null,
    loadingStops: false,
  }),

  getters: {
    allowedStops(state): Stop[] {
      return state.stops
        .filter((s) => isStopAllowed(s, state.allowedStates))
        .map((stop) => ({
          ...stop,
          substops: (stop.substops ?? []).filter((sub) =>
            isStopAllowed(sub, state.allowedStates),
          ),
        }))
    },

    flattenedStops(): FlattenedStop[] {
      const list = this.allowedStops.flatMap((stop) => {
        const base: FlattenedStop[] = [
          {
            id: stop.id,
            name: stop.name,
            type: stop.type === 'station' ? 'station' : 'city',
          },
        ]

        const substops: FlattenedStop[] = (stop.substops ?? []).map((sub) => ({
          id: sub.id,
          name: sub.name,
          type: 'station' as const,
          parent: stop.id,
        }))

        return [...base, ...substops]
      })

      const map = new Map<string, FlattenedStop>()
      for (const item of list) {
        map.set(item.id, item)
      }
      return Array.from(map.values())
    },

    filteredOrigins(): FlattenedStop[] {
      return filterStops(this.flattenedStops, this.originInput)
    },
    filteredDestinations(): FlattenedStop[] {
      return filterStops(this.flattenedStops, this.destinationInput)
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
        const { stops, allowedStates } = await getStops()
        this.stops = stops
        this.allowedStates = allowedStates
      } catch (e: unknown) {
        this.loadError = 'Não foi possível carregar os destinos.'
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

    selectOrigin(stop: FlattenedStop): void {
      this.selectedOrigin = { id: stop.id, name: stop.name, type: stop.type }
      this.originInput = stop.name
    },

    selectDestination(stop: FlattenedStop): void {
      this.selectedDestination = { id: stop.id, name: stop.name, type: stop.type }
      this.destinationInput = stop.name
    },

    search(): SearchTripsPayload | null {
      if (!this.canSearch) {
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
