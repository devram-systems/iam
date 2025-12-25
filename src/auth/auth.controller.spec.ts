import { Test, type TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should return a success message when the validation is called correctly', () => {
    const dto = {
      identity: 'user.example',
      password: 'pass-example',
    }

    const result = controller.validate(dto)

    expect(result).toEqual({
      message: 'Identity verified successfully',
    })
  })
})
