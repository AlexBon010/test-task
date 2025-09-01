import { ObjectId } from 'mongodb'

export interface RecordEntity {
	_id?: ObjectId
	uploadedFileId: ObjectId
	data: Record<string, unknown>
}
