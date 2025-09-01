import { Module } from '@nestjs/common'

import { UploadedFileService } from './services/uploadedFile.service'
import { mongodbProvider } from './mongodb.provider'

@Module({
	providers: [mongodbProvider, UploadedFileService],
	exports: [UploadedFileService],
})
export class MongodbModule { }
