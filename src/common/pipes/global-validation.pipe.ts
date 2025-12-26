import { BadRequestException, ValidationPipe, type ValidationPipeOptions } from '@nestjs/common'
import type { ValidationError } from 'class-validator'
import { ErrorCode } from '../errors/error-code.enum'

export function createGlobalValidationPipe(): ValidationPipe {
  const options: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors: ValidationError[]): BadRequestException => {
      const requiredFields = errors
        .filter((e) => Boolean(e.constraints?.isNotEmpty))
        .map((e) => e.property)

      const invalidFields = errors
        .filter((e) => Boolean(e.constraints && !('isNotEmpty' in e.constraints)))
        .map((e) => e.property)

      const details: Record<string, unknown> = {}
      if (requiredFields.length) details.requiredFields = requiredFields
      if (invalidFields.length) details.invalidFields = invalidFields

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
