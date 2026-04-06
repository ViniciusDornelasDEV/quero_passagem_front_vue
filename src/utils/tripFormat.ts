import type { Trip, TripDuration } from '../types/models'

function formatDurationFromFields(d: TripDuration | undefined): string {
  if (d == null || d === '') return '—'
  if (typeof d === 'string' || typeof d === 'number') return String(d)
  const h = d.hours ?? d.h
  const m = d.minutes ?? d.m
  if (h != null || m != null) {
    const parts: string[] = []
    if (h != null) parts.push(`${h}h`)
    if (m != null) parts.push(`${m}min`)
    return parts.join(' ') || '—'
  }
  return '—'
}

function padTimePart(t: string): string {
  const [h = '0', m = '0'] = t.split(':')
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

/**
 * Formats trip price total for display (BRL).
 */
export function formatPrice(total: number | string | null | undefined): string {
  if (total == null || total === '') return '—'
  if (typeof total === 'number') {
    return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }
  const normalized = String(total).trim().replace(/\./g, '').replace(',', '.')
  const n = Number(normalized)
  if (!Number.isFinite(n)) return String(total)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function resolveTripPriceTotal(trip: Trip): number | string | null {
  const p = trip.price
  if (p == null) return null
  if (typeof p === 'object' && 'total' in p) {
    const t = p.total
    if (t == null || t === '') return null
    return t as number | string
  }
  return p as number | string
}

/**
 * Duration label: explicit `duration` field, or inferred from departure/arrival when dates exist.
 */
export function formatDuration(trip: Trip): string {
  const fromExplicit = formatDurationFromFields(trip.duration)
  if (fromExplicit !== '—') return fromExplicit

  const depDate = trip.departure?.date
  const depTime = trip.departure?.time
  const arrDate = trip.arrival?.date
  const arrTime = trip.arrival?.time

  if (!depDate || !depTime || !arrDate || !arrTime) return '—'

  const start = new Date(`${depDate}T${padTimePart(depTime)}:00`)
  const end = new Date(`${arrDate}T${padTimePart(arrTime)}:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '—'

  let diffMs = end.getTime() - start.getTime()
  if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000

  const totalMin = Math.round(diffMs / 60000)
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  const parts: string[] = []
  if (h > 0) parts.push(`${h}h`)
  if (m > 0 || parts.length === 0) parts.push(`${m}min`)
  return parts.join(' ')
}
