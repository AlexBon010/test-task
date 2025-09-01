import { Module } from '@nestjs/common'

import { UploadedFileService } from './services/uploadedFile.service'
import { mongodbProvider, mongoClientProvider } from './mongodb.provider'

@Module({
	providers: [mongodbProvider, mongoClientProvider, UploadedFileService],
	exports: [UploadedFileService],
})
export class MongodbModule { }
