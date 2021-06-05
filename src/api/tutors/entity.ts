import { Appointment } from '../appointments/entity'
import { Gender, Role } from '../auth/entity'
import { Review } from '../reviews/entity'

export type Schedule = {
  id: number
  tutor?: Tutor
  startTime: string
  endTime: string
  closed: boolean
  reserved: boolean
  appointmentId?: number
  appointment?: Appointment
}

export type Tutor = {
  id: number
  createdAt?: Date
  updatedAt?: Date
  username: string
  fullname: string
  email: string
  language: string
  image: string
  gender: Gender
  presentation: string
  country: string
  schedules: Schedule[]
  verified?: boolean
  accepted?: boolean
  role?: Role
  reviews?: Review[]
  reviewCount: number
  rating: number
}

export type GetTutorsResponse = Tutor[]

export type GetTutorResponse = Tutor

export type UpdateTutorRequest = {
  id: number
  username: string
  fullname: string
  gender?: Gender
  image?: string
  language?: string
  presentation?: string
  country?: string
}

export type UpdateTutorResponse = {
  id: number
  username: string
  fullname: string
  language: string
  image: string
  gender: Gender
  presentation: string
  country: string
}

export type GetTutorSchedulesResponse = Schedule[]

export type SearchTutorsRequest = {
  startTime: string
  endTime: string
}

export type AddSchedulesRequest = {
  tutorId: number
  schedules: Date[]
}

export type AddSchedulesResponse = Tutor

export type RemoveSchedulesRequest = AddSchedulesRequest
export type RemoveSchedulesResponse = Tutor

export type AcceptTutorRequest = {
  tutorId: number
}

export type AcceptTutorResponse = Tutor
