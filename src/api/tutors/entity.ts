import { Dayjs } from 'dayjs'
import { Gender, Role } from '../auth/entity'

export type Schedule = {
  id: number
  tutor?: Tutor
  startTime: Date | Dayjs
  endTime: Date | Dayjs
  closed: boolean
  reserved: boolean
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
}

export type GetTutorsResponse = Tutor[]

export type GetTutorResponse = Tutor

export type UpdateTutorRequest = {
  id: string
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
