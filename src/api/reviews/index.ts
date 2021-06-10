import { APIClient } from '../apiClient'
import * as ReviewAPI from './api'

export const getReviews = APIClient.of(ReviewAPI.GetReviews)

export const getFeaturedReviews = APIClient.of(ReviewAPI.GetFeaturedReviews)

export const getAdminFeaturedReviews = APIClient.of(
  ReviewAPI.GetAdminFeaturedReviews
)

export const getTutorReviews = APIClient.of(ReviewAPI.GetTutorReviews)

export const getUserReviews = APIClient.of(ReviewAPI.GetUserReviews)

export const createReview = APIClient.of(ReviewAPI.CreateReview)

export const removeReview = APIClient.of(ReviewAPI.RemoveReview)

export const setReviewFeatured = APIClient.of(ReviewAPI.SetReviewFeatured)
