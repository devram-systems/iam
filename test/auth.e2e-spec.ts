import type { INestApplication } from '@nestjs/common'
import type { Server } from 'http'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'

describe('POST /auth/validate', () => {
  let app: INestApplication
  let server: Server

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    server = app.getHttpServer() as Server
  })

  it('should respond successfully when a valid request is sent', () => {
    const URL = '/auth/validate'

    return request(server).post(URL).expect(200).expect({ message: 'Success' })
  })

  afterAll(async () => {
    await app.close()
  })
})
