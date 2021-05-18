import { APIRequest } from '../interfaces/apiRequest'
import { HTTPMethod } from '../apiClient'
import { AxiosResponse } from 'axios'
import { ProjectsRequest, ProjectsResponse } from './entity'
import { parseWithPaginator } from '../paginator'

export namespace ProjectAPI {
  export class Projects<R extends ProjectsResponse> implements APIRequest<R> {
    auth = true
    path = '/projects'
    method = HTTPMethod.GET
    response!: R
    parse = (res: AxiosResponse<R>) => parseWithPaginator(res)
    constructor(public params: ProjectsRequest) {}
  }

  export class FeaturedProjects<
    R extends ProjectsResponse
  > extends Projects<R> {
    path = '/projects/featured'
  }

  export class MyProjects<R extends ProjectsResponse> extends Projects<R> {
    path = '/auth/user/projects/participated/'
  }
}
