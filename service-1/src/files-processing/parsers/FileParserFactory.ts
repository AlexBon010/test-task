import { BadRequestException, Injectable } from '@nestjs/common'

import { JsonFileParser } from './JsonFileParser'
import { ExcelFileParser } from './ExcelFileParser'
import { IFileParser } from './BaseFileParser.abstract'

@Injectable()
export class FileParserFactory {
    constructor(
        private readonly jsonFileParser: JsonFileParser,
        private readonly excelFileParser: ExcelFileParser
    ) { }

    getParser(fileExtension: string): IFileParser {
        const parsers: IFileParser[] = [
            this.jsonFileParser,
            this.excelFileParser,
        ]

        const parser = parsers.find(p => p.canParse(fileExtension))

        if (!parser) {
            throw new BadRequestException(
                'Unsupported file type. Only .json, .xlsx and .xls files are supported'
            )
        }

        return parser
    }
}
