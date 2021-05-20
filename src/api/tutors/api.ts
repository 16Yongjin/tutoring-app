import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import * as E from './entity'

const endpoint = '/tutors'

export class GetTutors<R extends E.GetTutorsResponse> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}/`
  constructor(id: number) {
    this.path = `${endpoint}/${id}`
  }
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

export class UpdateTutor<R extends E.UpdateTutorResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(public data: E.UpdateTutorResponse) {
    this.path = `${endpoint}/${data.id}/schedules`
  }
}

export class AddSchedules<R extends E.AddSchedulesResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id/schedules`
  constructor(public data: E.AddSchedulesRequest) {
    this.path = `${endpoint}/${data.tutorId}/schedules`
  }
}

export class RemoveSchedules<R extends E.RemoveSchedulesResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id/schedules/remove`
  constructor(public data: E.RemoveSchedulesRequest) {
    this.path = `${endpoint}/${data.tutorId}/schedules/remove`
  }
}
