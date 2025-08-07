import { Injectable, Logger } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import Redis from 'ioredis'

@Injectable()
export class ApiEventsService {
	private readonly logger = new Logger(ApiEventsService.name)
	private readonly retention = 30 * 24 * 60 * 60 * 1000

	constructor(@InjectRedis() private readonly redis: Redis) {}

	async recordResponseTime(
		endpoint: string,
		method: string,
		value: number,
		timestamp = Date.now()
	) {
		const key = `metrics:${method}:${endpoint}:response_time`
		await this.addPoint(key, timestamp, value, {
			endpoint,
			method,
			metric: 'response_time',
		})
	}

	private async addPoint(
		key: string,
		timestamp: number,
		value: number,
		labels: Record<string, string>
	) {
		try {
			await this.redis.call(
				'TS.ADD',
				key,
				timestamp.toString(),
				value.toString(),
				'RETENTION',
				this.retention.toString(),
				'LABELS',
				...Object.entries(labels).flatMap(([k, v]) => [k, v])
			)
		} catch (error) {
			this.logger.error(`Error adding point to ${key}: ${error.message}`, error.stack)
		}
	}
}
