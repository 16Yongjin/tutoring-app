import { AxiosResponse } from 'axios'
import { HTTPMethod } from '../apiClient'
import { APIResponse } from './apiResponse'

export type APIRequest<R extends APIResponse> = {
  response: R
  path: string
  method: HTTPMethod
  params?: any
  data?: any
  baseURL?: string
  headers?: Record<string, string>
  parse?: (data: AxiosResponse<R>) => R
  convertBody?: (data: any) => any
}
