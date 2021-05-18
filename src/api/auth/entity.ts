import { APIResponse } from '../interfaces/apiResponse'

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  TUTOR = 'tutor',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export type LoginRequest = {
  username: string
  password: string
}

export interface LoginResponse extends APIResponse {
  id: number
  username: string
  email: string
  token: string
  image: string
  language: string
  role: Role
}

export type SigninRequest = {
  username: string

  email: string

  password: string

  fullname: string

  language?: string

  gender?: Gender

  role?: string
}

export type SigninResponse = LoginResponse

export type ChangePasswordRequest = {
  username: string
  password: string
}

export type ChangePasswordResponse = LoginResponse
