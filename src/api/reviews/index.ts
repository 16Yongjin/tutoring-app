import { APIClient } from '../apiClient'
import * as ReviewAPI from './api'

export const getReviews = APIClient.of(ReviewAPI.GetReviews)

export const getTutorReviews = APIClient.of(ReviewAPI.GetTutorReviews)

export const getUserReviews = APIClient.of(ReviewAPI.GetUserReviews)

export const createReview = APIClient.of(ReviewAPI.CreateReview)

export const removeReview = APIClient.of(ReviewAPI.RemoveReview)
