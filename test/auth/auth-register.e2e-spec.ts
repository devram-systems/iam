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

  afterAll(async () => {
    await app.close()
  })
})
