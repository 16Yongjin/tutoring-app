import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import * as E from './entity'

const endpoint = '/materials'

export class GetMaterials<R extends E.GetMaterialsResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  path = `${endpoint}/`
  response!: R
  auth = false
}

export class GetMaterial<R extends E.GetMaterialResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}/:id`
  constructor(id: number) {
    this.path = `${endpoint}/${id}`
  }
}

export class GetCourse<R extends E.GetCourseResponse> implements APIRequest<R> {
  method = HTTPMethod.GET
  response!: R
  auth = false
  path = `${endpoint}/courses/:id`
  constructor(id: number) {
    this.path = `${endpoint}/courses/${id}`
  }
}

export class CreateMaterial<R extends E.CreateMaterialResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/`
  constructor(public data: E.CreateMaterialRequest) {}
}

export class CreateTopic<R extends E.CreateTopicResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/topics/`
  constructor(public data: E.CreateTopicRequest) {}
}

export class CreateCourse<R extends E.CreateCourseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/courses/`
  constructor(public data: E.CreateCourseRequest) {}
}

export class CreateExercise<R extends E.CreateExerciseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/exercises/`
  constructor(public data: E.CreateExerciseRequest) {}
}

export class UpdateMaterial<R extends E.UpdateMaterialResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(public data: E.UpdateMaterialRequest) {
    this.path = `${endpoint}/${data.id}`
  }
}

export class UpdateTopic<R extends E.UpdateTopicResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/topics/:id`
  constructor(public data: E.UpdateTopicRequest) {
    this.path = `${endpoint}/topics/${data.id}`
  }
}

export class UpdateCourse<R extends E.UpdateCourseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/courses/:id`
  constructor(public data: E.UpdateCourseRequest) {
    this.path = `${endpoint}/courses/${data.id}`
  }
}

export class UpdateExercise<R extends E.UpdateExerciseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.POST
  response!: R
  auth = true
  path = `${endpoint}/exercises/:id`
  constructor(public data: E.UpdateExerciseRequest) {
    this.path = `${endpoint}/exercises/${data.id}`
  }
}

export class DeleteMaterial<R extends E.DeleteMaterialResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/:id`
  constructor(id: number) {
    this.path = `${endpoint}/${id}`
  }
}

export class DeleteTopic<R extends E.DeleteTopicResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/topics/:id`
  constructor(id: number) {
    this.path = `${endpoint}/topics/${id}`
  }
}

export class DeleteCourse<R extends E.DeleteCourseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/courses/:id`
  constructor(id: number) {
    this.path = `${endpoint}/courses/${id}`
  }
}

export class DeleteExercise<R extends E.DeleteExerciseResponse>
  implements APIRequest<R>
{
  method = HTTPMethod.DELETE
  response!: R
  auth = true
  path = `${endpoint}/exercises/:id`
  constructor(id: number) {
    this.path = `${endpoint}/exercises/${id}`
  }
}
