import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  SignupRequest,
  SignupResponse,
  TutorSignupRequest,
} from './entity'
import { AcceptTutorRequest, AcceptTutorResponse } from '../tutors/entity'

export class Login<R extends LoginResponse> implements APIRequest<R> {
  method = HTTPMethod.POST
  path = '/auth/login/'
  response!: R
  auth = false
  constructor(public data: LoginRequest) {}
}

export class Signup<R extends SignupResponse> implements APIRequest<R> {
  method = HTTPMethod.POST
  path = '/auth/signup/'
  response!: R
  auth = false
  constructor(public data: SignupRequest) {}
}

export class TutorLogin<R extends LoginResponse> extends Login<R> {
  path = '/auth/tutors/login/'
}

export class TutorSignup<R extends SignupResponse> implements APIRequest<R> {
  method = HTTPMethod.POST
  path = '/auth/tutors/signup/'
  response!: R
  auth = false
  constructor(public data: TutorSignupRequest) {}
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

export class Me<R extends MeResponse> implements APIRequest<R> {
  method = HTTPMethod.GET
  path = '/auth/me/'
  response!: R
  auth = true
}

export class AcceptTutor<R extends AcceptTutorResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  path = '/auth/tutors/accept/'
  response!: R
  auth = true
  constructor(public data: AcceptTutorRequest) {}
}
