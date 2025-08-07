import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis'

import { LogsService } from './logs/logs.service';
import { ConfigsService } from '@cfg';

@Module({
    imports: [
        RedisModule.forRootAsync({
            useFactory: (configsService: ConfigsService) => {
                return configsService.redisConfig();
            },
            inject: [ConfigsService],
        }),
    ],
    providers: [LogsService],
    exports: [LogsService],
})
export class RedistimeseriesModule { }
