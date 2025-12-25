import { BadRequestException, ValidationPipe, type ValidationPipeOptions } from '@nestjs/common'
import { ErrorCode } from '../errors/error-code.enum'

export function createGlobalValidationPipe(): ValidationPipe {
  const options: ValidationPipeOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (): BadRequestException =>
      new BadRequestException({
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details: {
            requiredFields: ['identity', 'password'],
          },
        },
      }),
  }

  return new ValidationPipe(options)
}
