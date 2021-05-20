import { UserInfo } from '../auth/entity'
import { TutorInfo } from '../tutors/entity'

export type Review = {
  id: number
  text: string
  rating: number
  tutor?: TutorInfo
  user: { fullname: string } & Partial<UserInfo>
  createdAt?: Date
}

export type GetReviewsResponse = Review[]
export type GetTutorReviewsResponse = Review[]
export type GetUserReviewsResponse = Review[]

export type CreateReviewRequest = {
  userId: number
  tutorId: number
  rating: number
  text: string
}

export type CreateReviewResponse = Review

export type RemoveReviewResponse = Review
