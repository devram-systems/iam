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
        .filter((error) => Boolean(error.constraints?.isNotEmpty))
        .map((error) => error.property)

      return new BadRequestException({
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details: {
            requiredFields,
          },
        },
      })
    },
  }

  return new ValidationPipe(options)
}
