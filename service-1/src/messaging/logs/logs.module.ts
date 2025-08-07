import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { LogsService } from './logs/logs.service'
import { ConfigsService } from '@cfg'

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'LOGS_SERVICE',
				inject: [ConfigsService],
				useFactory: (configService: ConfigsService) => ({
					transport: Transport.KAFKA,
					...configService.kafkaConfig(),
				}),
			},
		]),
	],
	providers: [LogsService],
	exports: [LogsService],
})
export class LogsModule { }
