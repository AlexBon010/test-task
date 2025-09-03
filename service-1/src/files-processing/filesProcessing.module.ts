import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { FilesProcessingController } from './filesProcessing/filesProcessing.controller'
import { FilesProcessingService } from './filesProcessing/filesProcessing.service'
import { MongodbModule } from '@db'
import { LogsModule } from '../messaging'
import { FileParserFactory } from './parsers/FileParserFactory'
import { JsonFileParser } from './parsers/JsonFileParser'
import { ExcelFileParser } from './parsers/ExcelFileParser'

@Module({
	imports: [ConfigModule, MongodbModule, LogsModule],
	controllers: [FilesProcessingController],
	providers: [FilesProcessingService, FileParserFactory, JsonFileParser, ExcelFileParser],
})
export class FilesProcessingModule { }
