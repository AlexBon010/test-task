import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KafkaOptions } from '@nestjs/microservices'

@Injectable()
export class ConfigsService {
	constructor(private configService: ConfigService) { }

	redisConfig(): string {
		const redisHost = this.configService.get('REDIS_HOST')
		const redisPort = this.configService.get('REDIS_PORT')

		return `redis://${redisHost}:${redisPort}`
	}

	kafkaConfig(): KafkaOptions {
		const kafkaHost = this.configService.get('KAFKA_HOST')
		const kafkaPort = this.configService.get('KAFKA_PORT')

		return {
			options: {
				client: {
					clientId: 'logs-producer',
					brokers: [`${kafkaHost}:${kafkaPort}`],
				},
				producer: {
					allowAutoTopicCreation: true,
				},
			},
		}
	}

	mongoConfig(): string {
		const mongoHost = this.configService.get('MONGODB_HOST')
		const mongoPort = this.configService.get('MONGODB_PORT')

		return `mongodb://${mongoHost}:${mongoPort}/docs?replicaSet=rs0`
	}
}
