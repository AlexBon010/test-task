import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { pipeline, Readable, Writable } from 'stream'
import { parser } from 'stream-json'

import { streamValues } from 'stream-json/streamers/StreamValues'
import { UploadedFileService } from '@db'
import { BaseFileParser } from './BaseFileParser.abstract'

@Injectable()
export class JsonFileParser extends BaseFileParser {
    constructor(configService: ConfigService) {
        super(configService)
    }

    canParse(fileExtension: string): boolean {
        return fileExtension === 'json'
    }

    async parse(file: Express.Multer.File, uploadService: UploadedFileService, parentId: string): Promise<void> {
        this.validateFileSize(file)

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
}
