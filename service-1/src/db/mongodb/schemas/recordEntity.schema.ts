import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Mixed, ObjectId } from 'mongoose'

@Schema()
export class RecordEntity {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UploadedFile', required: true, index: true })
	uploadedFileId: ObjectId

	@Prop({ type: Map, of: mongoose.Schema.Types.Mixed, required: true })
	data: { type: Mixed }
}

export const RecordEntitySchema = SchemaFactory.createForClass(RecordEntity)
export type RecordEntityDocument = HydratedDocument<RecordEntity>
