import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { ConfigService } from '@nestjs/config'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  const configServer = app.get(ConfigService)

  const port = configServer.getOrThrow<number>('PORT')
  await app.listen(port)
}

void bootstrap()
