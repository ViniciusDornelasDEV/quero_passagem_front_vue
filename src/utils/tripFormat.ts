import type { Trip, TripDuration } from '../types/models'

export function formatDurationValue(d: TripDuration | undefined): string {
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

export function formatDuration(trip: Trip): string {
  return formatDurationValue(trip.duration)
}

/**
 * Formats `trip.price.total` or legacy flat `price` for display (BRL).
 */
export function formatTripTotal(trip: Trip): string {
  const p = trip.price
  if (p == null || p === '') return '—'
  if (typeof p === 'object') {
    return formatPrice(p.total)
  }
  return formatPrice(p)
}

export function formatPrice(
  value: number | string | null | undefined,
): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '—'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value)
  }
  const cleaned = String(value).trim()
  const n = Number(cleaned.replace(/\./g, '').replace(',', '.'))
  if (Number.isFinite(n)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(n)
  }
  return cleaned
}
