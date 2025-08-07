import { RedisModuleOptions } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ElasticsearchModuleOptions } from '@nestjs/elasticsearch'
import { KafkaOptions } from '@nestjs/microservices'

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
					clientId: 'logs-consumer',
					brokers: [`${kafkaHost}:${kafkaPort}`],
				},
				consumer: {
					allowAutoTopicCreation: true,
					groupId: 'logs-consumer-group',
				},
			},
		}
	}

	elasticsearchConfig(): ElasticsearchModuleOptions {
		const elasticsearchHost = this.configService.get('ELASTICSEARCH_HOST')
		const elasticsearchPort = this.configService.get('ELASTICSEARCH_PORT')

		return {
			node: `http://${elasticsearchHost}:${elasticsearchPort}`,
		}
	}
}
