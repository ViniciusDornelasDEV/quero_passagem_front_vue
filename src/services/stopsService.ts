import type { Stop, StopsFetchResult } from '../types/models'
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
  const type = raw.type === 'station' ? 'station' : 'city'
  const rawSubstops = Array.isArray(raw.substops) ? raw.substops : []
  const stateVal = raw.state
  const state = stateVal != null ? String(stateVal) : undefined
  const allowed = typeof raw.allowed === 'boolean' ? raw.allowed : undefined
  return {
    id: id != null ? String(id) : '',
    name: name != null ? String(name) : '',
    type,
    state,
    allowed,
    substops: rawSubstops.map(normalizeStop).filter((s) => s.id && s.name),
  }
}

export async function getStops(): Promise<StopsFetchResult> {
  const { data } = await api.get<StopsFetchResult>('/stops')

  let list: unknown[] = []
  let allowedStates: string[] = []

  if (Array.isArray(data)) {
    list = data
  } else if (isRecord(data)) {
    if (Array.isArray(data.data)) {
      list = data.data
    }
    if (isRecord(data.meta) && Array.isArray(data.meta.allowedStates)) {
      allowedStates = data.meta.allowedStates.map(String)
    }
  }

  const stops = list.map(normalizeStop).filter((s) => s.id && s.name)
  return { stops, allowedStates }
}
