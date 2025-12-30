import { BadRequestException, ValidationPipe, type ValidationPipeOptions } from '@nestjs/common'
import type { ValidationError } from 'class-validator'
import { ErrorCode } from '../errors/error-code.enum'
import {
  type InvalidRequestErrorDetails,
  type InvalidRequestErrorResponse,
} from '../errors/http-error-response'

export function createGlobalValidationPipe(): ValidationPipe {
  const options: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
      const details: InvalidRequestErrorDetails = {}

      errors.forEach((e) => {
        if (!e.constraints) return

        if ('isNotEmpty' in e.constraints) {
          details.requiredFields = details.requiredFields ?? []
          details.requiredFields.push(e.property)
        } else if ('whitelistValidation' in e.constraints) {
          details.forbiddenFields = details.forbiddenFields ?? []
          details.forbiddenFields.push(e.property)
        } else {
          details.invalidFields ??= {}

          const fieldErrors = (details.invalidFields[e.property] ??= [])

          Object.keys(e.constraints).forEach((constraint) => {
            fieldErrors.push(constraint)
          })
        }
      })

      const responseError: InvalidRequestErrorResponse = {
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details,
        },
      }

      return new BadRequestException(responseError)
    },
  }

  return new ValidationPipe(options)
}
