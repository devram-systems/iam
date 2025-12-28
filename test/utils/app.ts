import { Test } from '@nestjs/testing'
import type { INestApplication } from '@nestjs/common'
import type { Server } from 'http'
import { AppModule } from '../../src/app.module'
import { createGlobalValidationPipe } from '../../src/common/pipes/global-validation.pipe'

export async function createApp(): Promise<{
  app: INestApplication
  server: Server
}> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleRef.createNestApplication()
  app.useGlobalPipes(createGlobalValidationPipe())

  await app.init()

  return {
    app,
    server: app.getHttpServer() as Server,
  }
}
