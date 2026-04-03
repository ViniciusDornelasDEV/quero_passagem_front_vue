export type Stop = {
  id: string
  name: string
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

export type Trip = {
  id?: string
  class?: string
  duration?: TripDuration
  company: {
    id?: string
    name: string
    logo?: string
  }
  departure: {
    time: string
  }
  arrival: {
    time: string
  }
  price: number | string
  origin: {
    name: string
  }
  destination: {
    name: string
  }
}
