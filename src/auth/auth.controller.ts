import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ValidateDto } from './dto/validate.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  validate(@Body() body: ValidateDto): { message: string } {
    void body
    return { message: 'Identity verified successfully' }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: RegisterDto): { message: string } {
    this.authService.register(body)

    return { message: 'Authentication data created successfully' }
  }
}
