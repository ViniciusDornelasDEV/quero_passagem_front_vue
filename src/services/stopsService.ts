import type { Stop } from '../types/models'
import api from './api'

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null
}

function normalizeStop(raw: unknown): Stop {
  if (!isRecord(raw)) {
    return { id: '', name: '' }
  }
  const id = raw.id ?? raw.stop_id
  const name = raw.name ?? raw.nome ?? raw.title
  return {
    id: id != null ? String(id) : '',
    name: name != null ? String(name) : '',
  }
}

export async function getStops(): Promise<Stop[]> {
  const { data } = await api.get<unknown>('/stops')
  const list = Array.isArray(data) ? data : isRecord(data) && Array.isArray(data.data) ? data.data : []
  return list.map(normalizeStop).filter((s) => s.id && s.name)
}
