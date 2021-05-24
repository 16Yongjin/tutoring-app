import { Appointment } from '../appointments/entity'
import { Gender, Role } from '../auth/entity'
import { Review } from '../reviews/entity'

export type User = {
  id: number
  role: Role
  createdAt: Date
  updatedAt: Date
  username: string
  fullname: string
  email: string
  gender: Gender
  language: string
  image: string
  appointments?: Appointment[]
  reviews?: Review[]
}

export type UpdateUserRequest = {
  id: string
  username: string
  fullname: string
  gender: Gender
  language: string
}
