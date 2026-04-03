import { defineStore } from 'pinia'
import { getStops } from '../services/stopsService.js'

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function filterStops(stops, query) {
  const q = query.trim().toLowerCase()
  if (!q) {
    return stops.slice(0, 50)
  }
  return stops.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 50)
}

export const useSearchStore = defineStore('search', {
  state: () => ({
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
    filteredOrigins(state) {
      return filterStops(state.stops, state.originInput)
    },
    filteredDestinations(state) {
      return filterStops(state.stops, state.destinationInput)
    },
    canSearch(state) {
      return Boolean(
        state.selectedOrigin?.id &&
          state.selectedDestination?.id &&
          state.travelDate &&
          state.selectedOrigin.id !== state.selectedDestination.id,
      )
    },
    minTravelDate() {
      return todayISO()
    },
  },

  actions: {
    async fetchStops() {
      this.loadError = null
      this.loadingStops = true
      try {
        this.stops = await getStops()
      } catch (e) {
        const msg = e?.response?.data?.message ?? e?.message
        this.loadError =
          typeof msg === 'string' ? msg : 'Não foi possível carregar os destinos.'
      } finally {
        this.loadingStops = false
      }
    },

    setOrigin(input) {
      this.originInput = input
      if (this.selectedOrigin && input !== this.selectedOrigin.name) {
        this.selectedOrigin = null
      }
    },

    setDestination(input) {
      this.destinationInput = input
      if (this.selectedDestination && input !== this.selectedDestination.name) {
        this.selectedDestination = null
      }
    },

    selectOrigin(stop) {
      this.selectedOrigin = { id: stop.id, name: stop.name }
      this.originInput = stop.name
    },

    selectDestination(stop) {
      this.selectedDestination = { id: stop.id, name: stop.name }
      this.destinationInput = stop.name
    },

    search() {
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
