import api from './api'

export async function searchTrips(params) {
  const { data } = await api.post('/search', {
    from: params.from,
    to: params.to,
    travelDate: params.travelDate,
  })
  return data
}
