import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Readable } from 'stream'

import { GetInFileRequestDto } from '../dto/getInFileRequest.dto'
import { FileType, UploadedFileService } from '@db'
import { GetDocRequestDto, GetDocResponseDto } from '../dto/getDoc.dto'
import { FileParserFactory } from '../parsers/FileParserFactory'

@Injectable()
export class FilesProcessingService {
	constructor(
		private readonly httpService: HttpService,
		private readonly uploadedFileService: UploadedFileService,
		private readonly configService: ConfigService,
		private readonly fileParserFactory: FileParserFactory
	) { }

	async getInFile({ url }: GetInFileRequestDto) {
		try {
			const headResponse = await this.httpService.axiosRef.head(url)
			const contentLength = headResponse.headers['content-length']

			if (!contentLength) {
				const response = await this.httpService.axiosRef.get<Readable>(url, {
					responseType: 'stream',
				})
				return response.data
			}

			const fileSizeMB = parseInt(contentLength) / (1024 * 1024)
			const maxFileSizeMB = this.configService.get<number>('MAX_FILE_SIZE_MB') || 30

			if (fileSizeMB <= maxFileSizeMB) {
				const response = await this.httpService.axiosRef.get<Readable>(url, {
					responseType: 'stream',
				})
				return response.data
			}

			throw new BadRequestException(
				`File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxFileSizeMB}MB)`
			)
		} catch (error) {
			throw new BadRequestException(`Failed to get file from URL: ${error.message}`)
		}
	}

	async parseAndSaveFile(file: Express.Multer.File) {
		const fileExtension = this.getFileExtension(file.originalname)
		const parser = this.fileParserFactory.getParser(fileExtension)

		const parentId = await this.uploadedFileService.createParentDocument({
			originalFileName: file.originalname,
			fileType: fileExtension as FileType,
		})

		await parser.parse(file, this.uploadedFileService, parentId)
		return parentId
	}

	async getDoc(filters: GetDocRequestDto & { parentId: string }): Promise<GetDocResponseDto[]> {
		try {
			return await this.uploadedFileService.getRecordsByParentId(filters)
		} catch (err) {
			throw new BadRequestException(`Failed to get documents: ${err.message}`)
		}
	}

	private getFileExtension(filename: string): string {
		const extension = filename.split('.').pop()?.toLowerCase()
		if (!extension) {
			throw new BadRequestException('File must have an extension')
		}
		return extension
	}
}
