import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import { User, UpdateUserRequest } from './entity'

const endpoint = '/users'

export class GetUser<R extends User> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(userId: number) {
    this.path = `${endpoint}/${userId}`
  }
}

export class GetUsers<R extends User[]> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(userId: number) {
    this.path = `${endpoint}/${userId}`
  }
}

export class UpdateUser<R extends User> implements APIRequest<R> {
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(public data: UpdateUserRequest) {
    this.path = `${endpoint}/${data.id}`
  }
}
