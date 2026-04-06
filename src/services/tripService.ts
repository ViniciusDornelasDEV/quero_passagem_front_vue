import type { SearchTripsPayload } from '../types/models'
import api from './api'

export async function searchTrips(
  payload: SearchTripsPayload,
): Promise<unknown> {
  const { data } = await api.post<unknown>('/search', payload)
  return data
}
