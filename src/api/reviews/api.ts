import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import * as E from './entity'

const endpoint = '/reviews'

export class GetReviews<R extends E.GetReviewsResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/`
}
export class GetFeaturedReviews<R extends E.Review[]> extends GetReviews<R> {
  path = `${endpoint}/featured`
}

export class GetAdminFeaturedReviews<
  R extends E.Review[]
> extends GetReviews<R> {
  path = `${endpoint}/featured/admin`
}

export class GetTutorReviews<R extends E.GetTutorReviewsResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/tutors/:id`
  constructor(tutorId: number) {
    this.path = `${endpoint}/tutors/${tutorId}`
  }
}

export class GetUserReviews<R extends E.GetUserReviewsResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = true
  path = `${endpoint}/me`
}

export class CreateReview<R extends E.CreateReviewResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}`
  constructor(public data: E.CreateReviewRequest) {}
}

export class RemoveReview<R extends E.RemoveReviewResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(reviewId: number) {
    this.path = `${endpoint}/${reviewId}`
  }
}
export class SetReviewFeatured<R extends E.Review> implements APIRequest<R> {
  method = HTTPMethod.PUT
  response!: R
  auth = true
  path = `${endpoint}`
  constructor(public data: E.SetReviewFeaturedRequest) {
    this.path = `${endpoint}/${data.id}/featured`
  }
}
