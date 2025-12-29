import { Injectable } from '@nestjs/common'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  register(this: void, dto: RegisterDto): void {
    void dto
  }
}
