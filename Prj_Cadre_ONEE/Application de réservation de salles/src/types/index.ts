export type View = 'landing' | 'booking' | 'user-dashboard' | 'admin-dashboard' | 'room-detail'

export interface Room {
  id: string
  name: string
  capacity: number
  floor: string
  surface: number
  description: string
  equipment: string[]
  image: string
  available: boolean
  occupancyRate: number
}

export interface Participant {
  type: 'agent' | 'external'
  firstName: string
  lastName: string
  matricule?: string
  entity?: string
  fonction?: string
  societe?: string
}

export interface BookingData {
  date: Date | null
  startTime: string
  endTime: string
  participants: number
  coffeeBreak: boolean | null
  lunch: boolean | null
  lunchType: 'self-service' | 'table-service' | null
  participantsList: Participant[]
  equipment: string[]
  room: Room | null
}

export interface Reservation {
  id: string
  reference: string
  room: string
  date: string
  start: string
  end: string
  participants: number
  status: 'pending' | 'confirmed' | 'refused' | 'cancelled'
  requester: string
  coffeeBreak: boolean
  lunch: boolean
}
