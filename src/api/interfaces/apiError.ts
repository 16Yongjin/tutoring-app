export interface APIError {
  message: string
  status: number
  errors: Record<string, string>
  raw: Error
}
