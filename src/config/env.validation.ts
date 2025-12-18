import { plainToInstance } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsNumber, Min, validateSync } from 'class-validator'

export enum Environment {
  Local = 'local',
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  ENVIRONMENT!: Environment

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  PORT!: number
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })

  const errors = validateSync(validatedConfig, { skipMissingProperties: false })

  if (errors.length > 0) throw new Error(errors.toString())

  return validatedConfig
}
