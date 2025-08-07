import { Module } from '@nestjs/common'
import { FilesProcessingController } from './filesProcessing/filesProcessing.controller'
import { FilesProcessingService } from './filesProcessing/filesProcessing.service'
import { MongodbModule } from '@db'
import { LogsModule } from '../messaging'

@Module({
	imports: [MongodbModule, LogsModule],
	controllers: [FilesProcessingController],
	providers: [FilesProcessingService],
})
export class FilesProcessingModule { }
