import { APIResponse } from '../interfaces/apiResponse'
import { Pagination } from '../paginator'

type PaginatorResponse = {
  paginator: Pagination
}

type Project = {
  uid: string
  title: string
  summary: string
  description: string
  creditPerTask: number
  dueDate: Date
  progress: number
  participantsCount: number
  visibility: string
  allowed: boolean
  bookmarked: boolean
  createdAt: Date
}

export type ProjectsRequest = {
  pageSize: number
  ordering: string
  os: string
}

export interface ProjectsResponse extends APIResponse, PaginatorResponse {
  projects: Project[]
}
