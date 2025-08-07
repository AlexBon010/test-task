import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUrl, Matches } from 'class-validator'

export class GetInFileRequestDto {
	@ApiProperty({
		description: 'The URL of the file to download',
		example: 'https://jsonplaceholder.typicode.com/posts',
		required: true,
	})
	@IsUrl()
	url: string

	@ApiProperty({
		description: 'Custom filename for the downloaded file (supported formats: .json, .xlsx, .xls)',
		example: 'data-export.json',
		required: false,
	})
	@IsOptional()
	@IsString()
	@Matches(/\.(json|xlsx|xls)$/, { message: 'File extension must be one of: .json, .xlsx, .xls' })
	fileName?: string
}
