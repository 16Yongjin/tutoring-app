import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import * as E from './entity'

const endpoint = '/appointments'

export class GetAppointment<R extends E.Appointment> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(id: number) {
    this.path = `${endpoint}/${id}`
  }
}

export class GetAdminAppointments<R extends E.Appointment[]>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/`
}

export class GetUserAppointments<R extends E.Appointment[]>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/me`
}

export class GetUpcomingUserAppointment<R extends E.Appointment>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/upcoming`
}

export class GetTutorAppointments<
  R extends E.Appointment[]
> extends GetUserAppointments<R> {
  path = `${endpoint}/tutors`
}

export class GetUpcomingTutorAppointment<
  R extends E.Appointment
> extends GetUpcomingUserAppointment<R> {
  path = `${endpoint}/tutors/upcoming`
}

export class MakeAppointment<R extends E.Appointment> implements APIRequest<R> {
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/`
  constructor(public data: E.MakeAppointmentRequest) {}
}

export class RemoveAppointment<R extends E.Appointment>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(data: E.RemoveAppointmentRequest) {
    this.path = `${endpoint}/${data.appointmentId}`
  }
}

export class FeedbackAppointment<R extends E.Feedback>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/feedback`
  constructor(public data: E.FeedbackAppointmentRequest) {}
}
