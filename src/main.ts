import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'
import { createGlobalValidationPipe } from './common/pipes/global-validation.pipe'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(createGlobalValidationPipe())

  const configService = app.get(ConfigService)
  const port = configService.getOrThrow<number>('PORT')

  await app.listen(port)
}

void bootstrap()
