import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum FileType {
	JSON = 'json',
	XLSX = 'xlsx',
	XLS = 'xls',
}

@Schema()
export class UploadedFile {
	@Prop({ required: true })
	originalFileName: string

	@Prop({ required: true, enum: FileType, index: true })
	fileType: FileType
}

export type UploadedFileDocument = HydratedDocument<UploadedFile>
export const UploadedFileSchema = SchemaFactory.createForClass(UploadedFile)
