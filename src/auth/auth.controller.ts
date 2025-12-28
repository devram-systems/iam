import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ValidateDto } from './dto/validate.dto'

@Controller('auth')
export class AuthController {
  @Post('validate')
  @HttpCode(200)
  validate(@Body() body: ValidateDto): { message: string } {
    void body
    return { message: 'Identity verified successfully' }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(): { message: string } {
    return { message: 'Authentication data created successfully' }
  }
}
