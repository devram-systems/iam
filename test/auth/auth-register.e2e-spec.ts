import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import type { Server } from 'http'
import request from 'supertest'
import { createApp } from '../utils/app'

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
    const response = await request(server).post(URL).expect(HttpStatus.CREATED)

    expect(response.body).toEqual({
      message: 'Authentication data created successfully',
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
