import { Module } from '@nestjs/common'

import { ApiEventsService } from './apiEvents/apiEvents.service'
import { redisProvider } from './redis.provider'

@Module({
	providers: [redisProvider, ApiEventsService],
	exports: [ApiEventsService],
})
export class RedistimeseriesModule { }
