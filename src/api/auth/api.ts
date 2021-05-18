import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  SigninRequest,
  SigninResponse,
} from './entity'

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTPMethod.POST
  path = '/auth/login/'
  response!: R
  auth = false
  constructor(public data: LoginRequest) {}
}

export class Signup<R extends SigninResponse> implements APIRequest<R> {
  method = HTTPMethod.POST
  path = '/auth/signup/'
  response!: R
  auth = false
  constructor(public data: SigninRequest) {}
}

export class TutorLogin<R extends LoginResponse> extends Login<R> {
  path = '/auth/tutors/login/'
}

export class TutorSignup<R extends SigninResponse> extends Signup<R> {
  path = '/auth/tutors/signup/'
}

export class ChangePassword<R extends ChangePasswordResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  path = '/auth/change-password/'
  response!: R
  auth = true
  constructor(public data: ChangePasswordRequest) {}
}

export class TutorChangePassword<
  R extends ChangePasswordResponse
> extends ChangePassword<R> {
  path = '/auth/tutors/change-password/'
}
