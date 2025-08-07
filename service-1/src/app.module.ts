import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { CfgModule } from '@cfg'
import { DbModule, RedistimeseriesModule } from '@db'
import { LogsMiddleware } from '@utils'
import { LogsModule } from './messaging'
import { FilesProcessingModule } from './files-processing/filesProcessing.module'

@Module({
  imports: [
    CfgModule,
    DbModule,
    RedistimeseriesModule,
    LogsModule,
    HttpModule.register({
      global: true,
    }),
    FilesProcessingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*')
  }
}
