import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable } from '@nestjs/common'
import { pipeline, Readable, Writable } from 'stream'
import * as XLSX from 'xlsx'
import { parser } from 'stream-json'
import { streamValues } from 'stream-json/streamers/StreamValues'

import { GetInFileRequestDto } from '../dto/getInFileRequest.dto'
import { FileType, UploadedFileService } from '@db'
import { GetDocRequestDto, GetDocResponseDto } from '../dto/getDoc.dto'

@Injectable()
export class FilesProcessingService {
	constructor(
		private readonly httpService: HttpService,
		private readonly uploadedFileService: UploadedFileService
	) { }

	async getInFile({ url }: GetInFileRequestDto) {
		try {
			const response = await this.httpService.axiosRef.get<Readable>(url, {
				responseType: 'stream',
			})
			return response.data
		} catch (error) {
			throw new BadRequestException(`Failed to get file from URL: ${error.message}`)
		}
	}

	async parseAndSaveFile(file: Express.Multer.File) {
		const fileExtension = file.originalname.split('.').pop()?.toLowerCase()
		if (!fileExtension || !['json', 'xlsx', 'xls'].includes(fileExtension)) {
			throw new BadRequestException(
				'Unsupported file type. Only .json, .xlsx and .xls files are supported'
			)
		}

		const parentId = await this.uploadedFileService.createParentDocument({
			originalFileName: file.originalname,
			fileType: fileExtension as FileType,
		})

		if (fileExtension === 'json') {
			await this.parseJson(file, this.uploadedFileService, parentId)
			return parentId
		}

		if (fileExtension === 'xlsx' || fileExtension === 'xls') {
			await this.parseExcel(file, this.uploadedFileService, parentId)
			return parentId
		}

		return parentId
	}

	async getDoc(filters: GetDocRequestDto & { parentId: string }): Promise<GetDocResponseDto[]> {
		try {
			return await this.uploadedFileService.getRecordsByParentId(filters)
		} catch (err) {
			throw new BadRequestException(`Failed to get documents: ${err.message}`)
		}
	}

	private async parseJson(
		file: Express.Multer.File,
		uploadService: UploadedFileService,
		parentId: string
	) {
		try {
			const writable = new Writable({
				objectMode: true,
				write(chunk, _encoding, callback) {
					try {
						const parsedChunk = JSON.parse(JSON.stringify(chunk)).value
						void uploadService.createRecordsBatch(parentId, parsedChunk)
						callback()
					} catch (err) {
						callback(err)
					}
				},
			})

			const streamsPromise = (): Promise<void> =>
				new Promise((resolve, reject) => {
					pipeline(
						Readable.from(file.buffer, {
							highWaterMark: 1024 * 1024 * 10,
						}),
						parser(),
						streamValues(),
						writable,
						(err) => {
							if (err) {
								reject(err)
							}
							resolve()
						}
					)
				})
			await streamsPromise()
		} catch (err) {
			throw new BadRequestException(`Failed to parse JSON file: ${err.message}`)
		}
	}

	private async parseExcel(
		file: Express.Multer.File,
		uploadService: UploadedFileService,
		parentId: string
	) {
		try {
			const workbook = XLSX.read(file.buffer, { type: 'buffer' })

			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]

			const records: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, {
				defval: null,
				raw: false,
			})
			await uploadService.createRecordsBatch(parentId, records)
		} catch (err) {
			throw new BadRequestException(`Failed to parse Excel file: ${err.message}`)
		}
	}
}
