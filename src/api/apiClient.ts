import axios, { AxiosResponse } from 'axios'
import { APIRequest } from './interfaces/apiRequest'
import { APIResponse } from './interfaces/apiResponse'
import { APIError } from './interfaces/apiError'

const { API_URL = 'http://localhost:4000' } = process.env

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
  PUT = 'PUT',
}

type Constructor<T> = new (...args: any[]) => T

type ResponseType<T> = T extends APIRequest<infer T> ? T : never

export class APIClient {
  // API Client Singleton
  static shared = new APIClient()

  static request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return APIClient.shared.request(request)
  }

  /** API를 받아서 호출할 수 있는 함수로 변환합니다. */
  static toCallable<
    T extends Constructor<any>,
    U extends InstanceType<T>,
    R extends ResponseType<U> & APIError
  >(api: T) {
    return (...args: ConstructorParameters<T>) =>
      APIClient.request(new api(...args)) as Promise<R>
  }

  /** API를 호출할 수 있는 함수로 변환합니다. `toCallable`의 alias */
  static of = APIClient.toCallable

  // Local Server 또는 API Endpoint
  baseURL: string = API_URL
  // 타임 아웃
  timeout: number = 20 * 1000

  request<U extends APIResponse>(request: APIRequest<U>): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      axios
        .request({
          url: request.path,
          method: request.method,
          params: request.params,
          data: (request.convertBody || this.convertBody)(request.data),
          timeout: this.timeout,
          baseURL: request.baseURL || this.baseURL,
          headers: this.createHeaders(request),
          responseType: 'json',
        })
        .then((data: AxiosResponse<U>) => {
          const response = request.parse
            ? request.parse(data)
            : this.parse<U>(data)
          resolve(response)
        })
        .catch((err) => {
          const apiError = this.normalizeError(err)
          this.errorMiddleware(apiError)
          reject(apiError)
        })
    })
  }

  private convertBody(data: any) {
    return JSON.stringify(data)
  }

  // Default parser
  private parse<U extends APIResponse>(data: AxiosResponse<U>): U {
    return data.data
  }

  private errorMiddleware(error: APIError): void {
    // 인증 오류 발생 시 로그인 페이지로 쫓아냄
    if (error.status === 401) {
      console.error('auth error')
    }
  }

  // Convert axios error into APIError
  private normalizeError(error: any): APIError {
    return {
      status: error.response?.status,
      message: error.message,
      errors: error.errors,
      raw: error,
    }
  }
  // Create headers
  private createHeaders<U extends APIResponse>(request: APIRequest<U>): any {
    const headers: Record<string, string> = {}
    const csrfToken = this.getCsrfToken()
    const authToken = localStorage.getItem('AuthToken')

    // CSRF 토큰 삽입
    if (csrfToken && request.method !== HTTPMethod.GET) {
      headers['X-CSRFToken'] = csrfToken
    }

    // 인증 토큰 삽입
    if (authToken) {
      headers['Authorization'] = `Token ${localStorage.getItem('AuthToken')}`
    }

    // json body 사용
    if (request.method === HTTPMethod.POST) {
      headers['Content-Type'] = 'application/json'
    }

    // 기타 헤더 삽입
    if (request.headers) {
      Object.assign(headers, request.headers)
    }

    return headers
  }

  private getCsrfToken() {
    const csrfTokenEntry = document.cookie
      .split(' ')
      .map((e) => e.split('='))
      .find(([key]) => key === 'csrftoken')

    const csrfToken = csrfTokenEntry ? csrfTokenEntry[1] : null
    return csrfToken
  }
}
