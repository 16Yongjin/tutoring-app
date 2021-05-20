import { Dayjs } from 'dayjs'
import { Gender } from '../auth/entity'

export type Schedule = {
  id: number
  tutor?: TutorInfo
  startTime: Date | Dayjs
  endTime: Date | Dayjs
  closed: boolean
  reserved: boolean
}

export type TutorInfo = {
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
}

export type GetTutorsResponse = TutorInfo[]

export type GetTutorResponse = TutorInfo

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

export type UpdateTutorResponse = TutorInfo

export type AddSchedulesRequest = {
  tutorId: number
  schedules: Date[]
}

export type AddSchedulesResponse = TutorInfo

export type RemoveSchedulesRequest = AddSchedulesRequest
export type RemoveSchedulesResponse = TutorInfo
