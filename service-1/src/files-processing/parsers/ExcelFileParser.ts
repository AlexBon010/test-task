import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as XLSX from 'xlsx'

import { UploadedFileService } from '@db'
import { BaseFileParser } from './BaseFileParser.abstract'

@Injectable()
export class ExcelFileParser extends BaseFileParser {
    constructor(configService: ConfigService) {
        super(configService)
    }

    canParse(fileExtension: string): boolean {
        return fileExtension === 'xlsx' || fileExtension === 'xls'
    }

    async parse(file: Express.Multer.File, uploadService: UploadedFileService, parentId: string): Promise<void> {
        this.validateFileSize(file)

        try {
            const workbook = XLSX.read(file.buffer, { type: 'buffer' })

            const sheetName = workbook.SheetNames[0]
            if (!sheetName) {
                throw new BadRequestException('Excel file must contain at least one sheet')
            }

            const worksheet = workbook.Sheets[sheetName]

            const records: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, {
                defval: null,
                raw: false,
            })

            if (records.length === 0) {
                throw new BadRequestException('Excel file contains no data')
            }

            await uploadService.createRecordsBatch(parentId, records)
        } catch (err) {
            throw new BadRequestException(`Failed to parse Excel file: ${err.message}`)
        }
    }
}
