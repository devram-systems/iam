import type { INestApplication } from '@nestjs/common'
import type { Server } from 'http'
import request from 'supertest'
import { ErrorCode } from '../../src/common/errors/error-code.enum'
import { createApp } from '../utils/app'

describe('POST /auth/validate', () => {
  let app: INestApplication
  let server: Server

  const URL = '/auth/validate'

  beforeAll(async () => {
    const ctx = await createApp()
    app = ctx.app
    server = ctx.server
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

  it('should respond with a required fields error when the request body is empty', async () => {
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
    'should respond with an required fields when $description',
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
      invalidFields: { password: ['isString'] },
      description: 'password is of wrong type',
    },
    {
      body: { identity: 123, password: 'pass-example' },
      invalidFields: { identity: ['isString'] },
      description: 'identity is of wrong type',
    },
    {
      body: { identity: 123, password: 123 },
      invalidFields: {
        identity: ['isString'],
        password: ['isString'],
      },
      description: 'required fields are of wrong type',
    },
  ])(
    'should response an invalid fields error when $description',
    async ({ body, invalidFields }) => {
      const response = await request(server).post(URL).send(body).expect(400)

      expect(response.body).toMatchObject({
        message: 'Invalid request body',
        error: {
          code: ErrorCode.INVALID_REQUEST,
          details: { invalidFields },
        },
      })
    },
  )

  it('should respond with forbidden fields error when extra fields are sent', async () => {
    const response = await request(server)
      .post(URL)
      .send({
        identity: 'user.example',
        password: 'pass-example',
        otherField: 'value',
      })
      .expect(400)

    expect(response.body).toMatchObject({
      message: 'Invalid request body',
      error: {
        code: ErrorCode.INVALID_REQUEST,
        details: {
          forbiddenFields: ['otherField'],
        },
      },
    })
  })

  it('should respond with invalid requests errors when multiple problems occur', async () => {
    const response = await request(server)
      .post(URL)
      .send({
        password: 123,
        otherField: '',
      })
      .expect(400)

    expect(response.body).toMatchObject({
      message: 'Invalid request body',
      error: {
        code: ErrorCode.INVALID_REQUEST,
        details: {
          requiredFields: ['identity'],
          invalidFields: { password: ['isString'] },
          forbiddenFields: ['otherField'],
        },
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
