import { Test, type TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
  let controller: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should return a success message when validate is called correctly', () => {
    const dto = {
      identity: 'user.example',
      password: 'pass-example',
    }
    const result = controller.validate(dto)

    expect(result).toEqual({
      message: 'Identity verified successfully',
    })
  })

  it('should return a success message when register is called correctly', () => {
    const dto = {
      email: 'user.example',
      password: 'pass-example',
    }
    const result = controller.register(dto)

    expect(authService.register).toHaveBeenCalledTimes(1)
    expect(authService.register).toHaveBeenCalledWith(dto)

    expect(result).toEqual({
      message: 'Authentication data created successfully',
    })
  })
})
