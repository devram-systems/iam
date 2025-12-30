import { type ErrorCode } from './error-code.enum'

export interface InvalidRequestErrorDetails {
  requiredFields?: string[]
  forbiddenFields?: string[]
  invalidFields?: Record<string, string[]>
}

export interface InvalidRequestErrorResponse {
  message: string
  error: {
    code: ErrorCode
    details: InvalidRequestErrorDetails
  }
}
