import {
	Controller,
	Get,
	Param,
	Post,
	Query,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common'
import { Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Writable } from 'stream'

import { FilesProcessingService } from './filesProcessing.service'
import { GetInFileRequestDto } from '../dto/getInFileRequest.dto'
import { UploadFileResponseDto } from '../dto/uploadFileResponse.dto'
import { UploadFileDto } from '../dto/uploadFile.dto'
import { GetDocRequestDto, GetDocResponseDto } from '../dto/getDoc.dto'

@ApiTags('Files processing')
@Controller('files')
export class FilesProcessingController {
	constructor(private readonly filesProcessingService: FilesProcessingService) { }

	@ApiOperation({
		summary: 'Download file from URL',
		description:
			'Streams file from external URL directly to response. Supports large file downloads.',
	})
	@ApiResponse({
		status: 200,
		description: 'File download successful',
	})
	@Get('getDataInFile')
	async getInFile(@Query() query: GetInFileRequestDto, @Res() res: Response): Promise<Writable> {
		const { url, fileName } = query

		const fileData = await this.filesProcessingService.getInFile({ url })

		res.setHeader('Content-Type', 'application/octet-stream')
		if (fileName) {
			res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
		}
		return fileData.pipe(res)
	}

	@Post('upload')
	@ApiOperation({
		summary: 'Upload and parse file',
		description: 'Upload .json, .xlsx or .xls file and save its contents to MongoDB',
	})
	@ApiResponse({
		status: 201,
		description: 'File successfully uploaded and parsed',
		type: UploadFileResponseDto,
	})
	@ApiResponse({ status: 400, description: 'Invalid file format or content' })
	@ApiBody({ type: UploadFileDto })
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadFileResponseDto> {
		const id = await this.filesProcessingService.parseAndSaveFile(file)
		return { id }
	}

	@Get('doc/:id')
	@ApiOperation({
		summary: 'Get documents by parent ID',
		description: 'Get documents with search and pagination',
	})
	@ApiResponse({ status: 200, description: 'Documents found', type: [GetDocResponseDto] })
	@ApiResponse({ status: 404, description: 'Parent document not found' })
	async getDoc(
		@Query() query: GetDocRequestDto,
		@Param('id') id: string
	): Promise<GetDocResponseDto[]> {
		const result = await this.filesProcessingService.getDoc({
			...query,
			parentId: id,
		})
		return result
	}
}
