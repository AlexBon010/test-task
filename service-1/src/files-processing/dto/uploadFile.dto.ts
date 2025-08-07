import { ApiProperty } from '@nestjs/swagger'

export class UploadFileDto {
	@ApiProperty({
		type: 'string',
		format: 'binary',
		description: 'File to upload (.json, .xlsx, .xls)',
	})
	file: Express.Multer.File
}

export class UploadFileResponseDto {
	@ApiProperty({
		example: '507f1f77bcf86cd799439011',
		description: 'ID of the uploaded and processed file',
	})
	id: string
}
