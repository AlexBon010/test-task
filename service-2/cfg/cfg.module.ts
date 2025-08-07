import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resolve } from 'path'

import { validate } from './env.validation'
import { ConfigsService } from './configs.service'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			validate,
			envFilePath: [resolve(__dirname, '..', '..', '..', '.env')],
		}),
	],
	providers: [ConfigsService],
	exports: [ConfigsService],
})

export class CfgModule { }
