import api from './api'

export async function fetchSeatMatrix(travelId: string): Promise<unknown> {
  const { data } = await api.post<unknown>('/seats', {
    travelId,
    orientation: 'horizontal',
    type: 'matrix',
  })
  return data
}
