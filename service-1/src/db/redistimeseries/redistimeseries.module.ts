import { Module } from '@nestjs/common'
import { RedisModule } from '@nestjs-modules/ioredis'

import { ApiEventsService } from './apiEvents/apiEvents.service'
import { ConfigsService } from '@cfg'

@Module({
	imports: [
		RedisModule.forRootAsync({
			useFactory: (configService: ConfigsService) => {
				return configService.redisConfig()
			},
			inject: [ConfigsService],
		}),
	],
	providers: [ApiEventsService],
	exports: [ApiEventsService],
})
export class RedistimeseriesModule { }
