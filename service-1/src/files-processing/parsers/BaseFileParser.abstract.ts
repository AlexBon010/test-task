import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UploadedFileService } from '@db'

export interface IFileParser {
    canParse(fileExtension: string): boolean
    parse(file: Express.Multer.File, uploadService: UploadedFileService, parentId: string): Promise<void>
}

@Injectable()
export abstract class BaseFileParser implements IFileParser {
    constructor(protected readonly configService: ConfigService) { }

    abstract canParse(fileExtension: string): boolean
    abstract parse(file: Express.Multer.File, uploadService: UploadedFileService, parentId: string): Promise<void>

    protected validateFileSize(file: Express.Multer.File): void {
        const fileSizeMB = file.size / (1024 * 1024)
        const maxFileSizeMB = this.configService.get<number>('MAX_FILE_SIZE_MB')!

        if (fileSizeMB > maxFileSizeMB) {
            throw new BadRequestException(
                `File size (${fileSizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxFileSizeMB}MB)`
            )
        }
    }

    protected getFileExtension(filename: string): string {
        const extension = filename.split('.').pop()?.toLowerCase()
        if (!extension) {
            throw new BadRequestException('File must have an extension')
        }
        return extension
    }
}
