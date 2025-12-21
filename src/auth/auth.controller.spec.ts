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

  // TODO: provisional test
  it('should return a success message', () => {
    const result = controller.validate()
    expect(result).toEqual({ message: 'Success' })
  })
})
