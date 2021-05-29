import { Review } from '../reviews/entity'
import { Tutor } from '../tutors/entity'
import { User } from '../users/entity'

export type Feedback = {
  id: number
  appointment?: Appointment
  text: string
}

export type Appointment = {
  id: number
  tutor: Tutor
  user: User
  startTime: string
  endTime: string
  material: string
  request: string
  feedbackId: number
  feedback?: Feedback
  cancelable: boolean
  finished: boolean
}

export type MakeAppointmentRequest = {
  userId: number
  tutorId: number
  startTime: Date
  material: string
  request: string
}

export type RemoveAppointmentRequest = {
  appointmentId: number
}

export type FeedbackAppointmentRequest = {
  appointmentId: number
  text: string
}
