import { BadRequestException, ValidationPipe, type ValidationPipeOptions } from '@nestjs/common'
import type { ValidationError } from 'class-validator'
import { ErrorCode } from '../errors/error-code.enum'

export function createGlobalValidationPipe(): ValidationPipe {
  const options: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
      const details: Record<string, string[]> = {}

      errors.forEach((e) => {
        if (!e.constraints) return

        if ('isNotEmpty' in e.constraints) {
          details.requiredFields = details.requiredFields ?? []
          details.requiredFields.push(e.property)
        } else if ('whitelistValidation' in e.constraints) {
          details.forbiddenFields = details.forbiddenFields ?? []
          details.forbiddenFields.push(e.property)
        } else {
          details.invalidFields = details.invalidFields ?? []
          details.invalidFields.push(e.property)
        }
      })

      return new BadRequestException({
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details,
        },
      })
    },
  }

  return new ValidationPipe(options)
}
