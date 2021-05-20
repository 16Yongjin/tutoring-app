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
