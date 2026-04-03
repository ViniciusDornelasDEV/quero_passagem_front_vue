import api from './api'

function normalizeStop(raw) {
  const id = raw?.id
  const name = raw?.name
  return {
    id: id != null ? String(id) : '',
    name: name != null ? String(name) : '',
  }
}

export async function getStops() {
  const { data } = await api.get('/stops')
  const list = Array.isArray(data) ? data : data?.data
  if (!Array.isArray(list)) {
    return []
  }
  return list.map(normalizeStop).filter((s) => s.id && s.name)
}
