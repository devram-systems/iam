import { Controller, HttpCode, Post } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  @Post('validate')
  @HttpCode(200)
  validate(): { message: string } {
    return { message: 'Success' }
  }
}
