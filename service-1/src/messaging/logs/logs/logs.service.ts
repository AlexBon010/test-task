import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

import { ILog } from '../../interfaces/log.interface'

@Injectable()
export class LogsService implements OnModuleInit {
	constructor(
		@Inject('LOGS_SERVICE')
		private readonly client: ClientKafka
	) { }
	async onModuleInit() {
		await this.client.connect()
	}

	private readonly LOG_TOPIC = 'logs'
	private readonly SERVICE_NAME = 'task-service-1'

	info(message: string) {
		this.log('info', message)
	}

	error(message: string) {
		this.log('error', message)
	}

	private log(level: ILog['level'], message: string) {
		const logEntry: ILog = {
			level,
			message,
			timestamp: new Date().toISOString(),
			service: this.SERVICE_NAME,
		}

		this.client.emit(this.LOG_TOPIC, logEntry)
	}
}
