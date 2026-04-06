export type StopType = 'city' | 'station'

export type Stop = {
  id: string
  name: string
  type?: StopType
  state?: string
  allowed?: boolean
  substops?: Stop[]
}

export type StopsFetchResult = {
  stops: Stop[]
  allowedStates: string[]
}

export type FlattenedStop = {
  id: string
  name: string
  type: StopType
  parent?: string
}

export type SearchTripsPayload = {
  from: string
  to: string
  travelDate: string
}

export type TripDuration =
  | string
  | number
  | { hours?: number; h?: number; minutes?: number; m?: number }

export type TripPrice = {
  seat?: number | string | null
  tax?: number | string | null
  total?: number | string | null
  insurance?: number | string | null
}

export type Trip = {
  id?: string
  seatClass?: string
  duration?: TripDuration
  company: {
    id?: string
    name: string
    logo?: string | null
  }
  departure: {
    date?: string
    time?: string
  }
  arrival: {
    date?: string
    time?: string
  }
  price?: number | string | TripPrice
  from?: {
    id?: string
    name?: string
  }
  to?: {
    id?: string
    name?: string
  }
  availableSeats?: number
}

export type SeatMatrixItem = {
  seat_number?: string
  occupied?: boolean
  type?: string
  position: {
    x: number
    y: number
  }
}
