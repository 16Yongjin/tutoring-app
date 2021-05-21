import { APIClient } from '../apiClient'
import * as AuthAPI from './api'

export const login = APIClient.of(AuthAPI.Login)

export const signup = APIClient.of(AuthAPI.Signup)

export const changePassword = APIClient.of(AuthAPI.ChangePassword)

export const tutorLogin = APIClient.of(AuthAPI.TutorLogin)

export const tutorSignup = APIClient.of(AuthAPI.TutorSignup)

export const tutorChangePassword = APIClient.of(AuthAPI.TutorChangePassword)

export const me = APIClient.of(AuthAPI.Me)

export const acceptTutor = APIClient.of(AuthAPI.AcceptTutor)
