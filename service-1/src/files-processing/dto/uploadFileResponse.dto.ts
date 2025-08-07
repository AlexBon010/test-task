import { ApiProperty } from '@nestjs/swagger'

export class UploadFileResponseDto {
	@ApiProperty({
		description: 'MongoDB document ID of the uploaded file',
		example: '507f1f77bcf86cd799439011',
	})
	id: string
}
