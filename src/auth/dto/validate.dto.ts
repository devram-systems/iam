import { IsNotEmpty, IsString } from 'class-validator'

export class ValidateDto {
  @IsString()
  @IsNotEmpty()
  identity!: string

  @IsString()
  @IsNotEmpty()
  password!: string
}
