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

export interface UserInfo {
  id: number
  username: string
  email: string
  token: string
  image: string
  language: string
  role: Role
}

export interface LoginResponse extends APIResponse, UserInfo {}

export type SignupRequest = {
  username: string
  email: string
  password: string
  fullname: string
  language?: string
  gender?: Gender
}

export type TutorSignupRequest = {
  username: string
  email: string
  password: string
  fullname: string
  gender: string
}

export type SignupResponse = LoginResponse
export type MeResponse = LoginResponse

export type ChangePasswordRequest = {
  username: string
  password: string
}

export type ChangePasswordResponse = LoginResponse
