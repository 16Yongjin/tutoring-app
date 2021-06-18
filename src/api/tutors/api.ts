import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import * as E from './entity'

const endpoint = '/tutors'

export class GetTutors<R extends E.GetTutorsResponse> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}`
}
export class GetTutorsByAdmin<
  R extends E.GetTutorsResponse
> extends GetTutors<R> {
  auth = true
  path = `${endpoint}/admin`
}

export class GetTutor<R extends E.GetTutorResponse> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}/:id`
  constructor(id: number) {
    this.path = `${endpoint}/${id}`
  }
}
export class SearchTutors<R extends E.Tutor[]> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}/search`
  params = {}
  constructor(params: E.SearchTutorsRequest) {
    this.params = params
  }
}

export class UpdateTutor<R extends E.UpdateTutorResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(public data: E.UpdateTutorRequest) {
    this.path = `${endpoint}/${data.id}`
  }
}

export class GetTutorSchedules<R extends E.Schedule[]>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/:id/schedules`
  constructor(tutorId: number) {
    this.path = `${endpoint}/${tutorId}/schedules`
  }
}

export class AddSchedule<R extends E.Schedule> implements APIRequest<R> {
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id/schedules`
  constructor(public data: E.AddScheduleRequest) {
    this.path = `${endpoint}/${data.tutorId}/schedules`
  }
}

export class RemoveSchedules<R extends E.Schedule> implements APIRequest<R> {
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id/schedules/remove`
  constructor(public data: E.RemoveScheduleRequest) {
    this.path = `${endpoint}/${data.tutorId}/schedules/remove`
  }
}
