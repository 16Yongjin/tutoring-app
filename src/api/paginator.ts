import { AxiosResponse } from 'axios'
import { APIResponse } from './interfaces/apiResponse'

export interface Pagination {
  page: number
  itemCount: number
  numPages: number
  pageSize: number
}

export const extractPagination = (
  headers: Record<string, string>
): Pagination => {
  const page = parseInt(headers['page-currentpage'])
  const itemCount = parseInt(headers['page-itemcount'])
  const numPages = parseInt(headers['page-numpages'])
  const pageSize = parseInt(headers['page-perpage'])

  return { page, itemCount, numPages, pageSize }
}

export const parseWithPaginator = <T extends APIResponse>(
  res: AxiosResponse<T>
): T => {
  return {
    ...res.data,
    paginator: extractPagination(res.headers),
  }
}
