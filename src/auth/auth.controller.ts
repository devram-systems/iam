import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { ValidateDto } from './dto/validate.dto'

@Controller('auth')
export class AuthController {
  @Post('validate')
  @HttpCode(200)
  validate(@Body() body: ValidateDto): { message: string } {
    void body
    return { message: 'Identity verified successfully' }
  }
}
