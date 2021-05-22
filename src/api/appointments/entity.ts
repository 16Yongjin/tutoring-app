import { UserInfo } from '../auth/entity'
import { Tutor } from '../tutors/entity'

export type Feedback = {
  id: number
  appointment?: Appointment
  text: string
}

export type Appointment = {
  id: number
  tutor: Tutor
  user: UserInfo
  startTime: string
  endTime: string
  material: string
  request: string
  feedbackId: number
  feedback: Feedback
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
