import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { UploadedFile, UploadedFileSchema } from './schemas/uploadedFile.schema'
import { RecordEntity, RecordEntitySchema } from './schemas/recordEntity.schema'
import { UploadedFileService } from './services/uploadedFile.service'
import { ConfigsService } from '@cfg'

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: (configService: ConfigsService) => {
				return configService.mongoConfig()
			},
			inject: [ConfigsService],
		}),
		MongooseModule.forFeature([
			{ name: UploadedFile.name, schema: UploadedFileSchema },
			{ name: RecordEntity.name, schema: RecordEntitySchema },
		]),
	],
	providers: [UploadedFileService],
	exports: [UploadedFileService],
})
export class MongodbModule { }
