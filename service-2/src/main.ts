import { NestFactory, Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { json } from 'express'
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  const port = configService.get<number>('SERVICE_2_PORT')!

  const kafkaHost = configService.get<string>('KAFKA_HOST')!
  const kafkaPort = configService.get<number>('KAFKA_PORT')!

  app.enableCors({
    origin: '*',
  })

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${kafkaHost}:${kafkaPort}`],
      },
      consumer: {
        groupId: 'logs-consumer-group',
      },
    },
  })

  app.setGlobalPrefix('api')

  app.use(json())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  )

  const config = new DocumentBuilder()
    .setTitle('Service B api')
    .setDescription('API description')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)

  await Promise.all([
    app.startAllMicroservices(),
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  ])

}
void bootstrap()