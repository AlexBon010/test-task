import { RedisModuleOptions } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { KafkaOptions } from '@nestjs/microservices'
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose'

@Injectable()
export class ConfigsService {
	constructor(private configService: ConfigService) { }

	redisConfig(): RedisModuleOptions {
		const redisHost = this.configService.get('REDIS_HOST')
		const redisPort = this.configService.get('REDIS_PORT')

		const url = `redis://${redisHost}:${redisPort}`

		return {
			url,
			type: 'single',
		}
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

	mongoConfig(): MongooseModuleFactoryOptions {
		const mongoHost = this.configService.get('MONGODB_HOST')
		const mongoPort = this.configService.get('MONGODB_PORT')

		return {
			uri: `mongodb://${mongoHost}:${mongoPort}/docs`,
		}
	}
}
