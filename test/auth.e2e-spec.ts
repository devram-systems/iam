import type { INestApplication } from '@nestjs/common'
import type { Server } from 'http'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '../src/app.module'
import { ErrorCode } from '../src/common/errors/error-code.enum'
import { createGlobalValidationPipe } from '../src/common/pipes/global-validation.pipe'

describe('POST /auth/validate', () => {
  let app: INestApplication
  let server: Server

  const URL = '/auth/validate'

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(createGlobalValidationPipe())

    await app.init()
    server = app.getHttpServer() as Server
  })

  it('should receive a success message when a valid request is sent', async () => {
    const response = await request(server)
      .post(URL)
      .send({
        identity: 'user.example',
        password: 'pass-example',
      })
      .expect(200)

    expect(response.body).toEqual({
      message: 'Identity verified successfully',
    })
  })

  it('should respond with a invalid requests when the request body is empty', async () => {
    const response = await request(server).post(URL).expect(400)

    expect(response.body).toMatchObject({
      message: 'Invalid request body',
      error: {
        code: ErrorCode.INVALID_REQUEST,
        details: {
          requiredFields: ['identity', 'password'],
        },
      },
    })
  })

  it.each([
    {
      body: { identity: 'user.example' },
      requiredFields: ['password'],
      description: 'password is empty',
    },
    {
      body: { password: 'pass-example' },
      requiredFields: ['identity'],
      description: 'identity is empty',
    },
    {
      body: { other: 'value' },
      requiredFields: ['identity', 'password'],
      description: 'other field is sent',
    },
  ])(
    'should respond with an invalid request when $description',
    async ({ body, requiredFields }) => {
      const response = await request(server).post(URL).send(body).expect(400)

      expect(response.body).toMatchObject({
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details: { requiredFields },
        },
      })
    },
  )

  it.each([
    {
      body: { identity: 'user.example', password: 123 },
      invalidFields: ['password'],
      description: 'password is of wrong type',
    },
    {
      body: { identity: 123, password: 'pass-example' },
      invalidFields: ['identity'],
      description: 'identity is of wrong type',
    },
    {
      body: { identity: 123, password: 123 },
      invalidFields: ['identity', 'password'],
      description: 'required fields are of wrong type',
    },
  ])('should response a invalid request when $description', async ({ body, invalidFields }) => {
    const response = await request(server).post(URL).send(body).expect(400)

    expect(response.body).toMatchObject({
      message: 'Invalid request body',
      error: {
        code: ErrorCode.INVALID_REQUEST,
        details: { invalidFields },
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
