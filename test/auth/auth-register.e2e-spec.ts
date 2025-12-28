import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import type { Server } from 'http'
import request from 'supertest'
import { createApp } from '../utils/app'
import { ErrorCode } from '../../src/common/errors/error-code.enum'

describe('POST /auth/register', () => {
  let app: INestApplication
  let server: Server

  const URL = '/auth/register'

  beforeAll(async () => {
    const ctx = await createApp()
    app = ctx.app
    server = ctx.server
  })

  it('should receive a success message when a valid request is sent', async () => {
    const response = await request(server)
      .post(URL)
      .send({
        email: 'user.example',
        password: 'pass-example',
      })
      .expect(HttpStatus.CREATED)

    expect(response.body).toEqual({
      message: 'Authentication data created successfully',
    })
  })

  it('should respond with a required fields error when the request body is empty', async () => {
    const response = await request(server).post(URL).expect(400)

    expect(response.body).toMatchObject({
      message: 'Invalid request body',
      error: {
        code: ErrorCode.INVALID_REQUEST,
        details: {
          requiredFields: ['email', 'password'],
        },
      },
    })
  })

  it.each([
    {
      body: { email: 'email@example.com' },
      requiredFields: ['password'],
      description: 'password is empty',
    },
    {
      body: { password: 'pass-example' },
      requiredFields: ['email'],
      description: 'email is empty',
    },
    {
      body: { other: 'value' },
      requiredFields: ['email', 'password'],
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
      body: { email: 'email@example.com', password: 123 },
      invalidFields: ['password'],
      description: 'password is of wrong type',
    },
    {
      body: { email: 123, password: 'pass-example' },
      invalidFields: ['email'],
      description: 'email is of wrong type',
    },
    {
      body: { email: 123, password: 123 },
      invalidFields: ['email', 'password'],
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
        email: 'email@example.com',
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
          requiredFields: ['email'],
          invalidFields: ['password'],
          forbiddenFields: ['otherField'],
        },
      },
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
