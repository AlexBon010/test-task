import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class GetDocRequestDto {
	@ApiProperty({ example: 20, description: 'Number of documents per page', required: false })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	docsPerPage?: number

	@ApiProperty({ example: 1, description: 'Page number (starts from 1)', required: false })
	@IsNumber()
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	page?: number

	@ApiProperty({
		example: 100,
		description: 'Limit of documents to return',
		required: false,
		default: 100,
	})
	@IsNumber({ allowInfinity: false })
	@IsOptional()
	@Type(() => Number)
	@Min(1)
	limit?: number = 100

	@ApiProperty({
		example: 'age>25,price<=1000,city=New York',
		description: 'Filter string in format: field>value,field<value. Operators: >, <, >=, <=, =',
		required: false,
	})
	@IsString()
	@IsOptional()
	filter?: string
}

export class GetDocResponseDto {
	[key: string]: unknown
}
