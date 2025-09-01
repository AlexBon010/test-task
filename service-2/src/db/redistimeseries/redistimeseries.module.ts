import { Module } from '@nestjs/common'

import { LogsService } from './logs/logs.service'
import { redisProvider } from './redis.provider'

@Module({
    providers: [redisProvider, LogsService],
    exports: [LogsService],
})
export class RedistimeseriesModule { }
