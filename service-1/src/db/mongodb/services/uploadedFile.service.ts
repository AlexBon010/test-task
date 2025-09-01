import { Injectable, Inject } from '@nestjs/common'
import { Collection, Db, ObjectId } from 'mongodb'

import { UploadedFile } from '../schemas/uploadedFile.schema'
import { RecordEntity } from '../schemas/recordEntity.schema'
import { GetDocRequestDto, GetDocResponseDto } from '../../../files-processing/dto/getDoc.dto'
import { parseFilterString } from './filterParsing.util'

@Injectable()
export class UploadedFileService {
	private uploadedFileCollection: Collection<UploadedFile>
	private recordEntityCollection: Collection<RecordEntity>

	constructor(@Inject('MONGODB_CONNECTION') private db: Db) {
		this.uploadedFileCollection = this.db.collection<UploadedFile>('uploadedfiles')
		this.recordEntityCollection = this.db.collection<RecordEntity>('recordentities')
		void this.createIndexes()
	}

	private async createIndexes(): Promise<void> {
		try {
			// Index for fileType in UploadedFile collection
			await this.uploadedFileCollection.createIndex({ fileType: 1 })

			// Index for uploadedFileId in RecordEntity collection  
			await this.recordEntityCollection.createIndex({ uploadedFileId: 1 })
		} catch (error) {
			// Index creation errors are not critical, just log them
			console.warn('Failed to create MongoDB indexes:', error)
		}
	}

	async createParentDocument(data: Omit<UploadedFile, '_id'>): Promise<string> {
		const result = await this.uploadedFileCollection.insertOne(data)
		return result.insertedId.toString()
	}

	async createRecordsBatch(
		parentId: string,
		records: Record<string, unknown>[]
	): Promise<void> {
		if (!records.length) return

		const batchSize = 50000

		for (let start = 0; start < records.length; start += batchSize) {
			const batch = records.slice(start, start + batchSize)

			const recordEntities: Omit<RecordEntity, '_id'>[] = batch.map(record => ({
				uploadedFileId: new ObjectId(parentId),
				data: record
			}))

			await this.recordEntityCollection.insertMany(recordEntities, {
				ordered: false
			})
		}
	}

	async getRecordsByParentId({
		parentId,
		page,
		docsPerPage,
		limit = 100,
		filter,
	}: GetDocRequestDto & { parentId: string }): Promise<GetDocResponseDto[]> {
		const filterQuery = parseFilterString(filter)

		const query = {
			uploadedFileId: new ObjectId(parentId),
			...filterQuery,
		}

		const options: any = {
			projection: { data: 1, _id: 0 }
		}

		if (page && docsPerPage) {
			const skip = (page - 1) * docsPerPage
			options.skip = skip
			options.limit = Math.min(docsPerPage, limit)
		} else {
			options.limit = limit
		}

		const cursor = this.recordEntityCollection.find(query, options)
		const data = await cursor.toArray()

		return data.map((doc) => doc.data)
	}
}
