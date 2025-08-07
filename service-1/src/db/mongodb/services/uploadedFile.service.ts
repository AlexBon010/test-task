import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { UploadedFile, UploadedFileDocument } from '../schemas/uploadedFile.schema'
import { RecordEntity, RecordEntityDocument } from '../schemas/recordEntity.schema'
import { GetDocRequestDto, GetDocResponseDto } from '../../../files-processing/dto/getDoc.dto'
import { parseFilterString } from './filterParsing.util'

@Injectable()
export class UploadedFileService {
	constructor(
		@InjectModel(UploadedFile.name) private uploadedFileModel: Model<UploadedFileDocument>,
		@InjectModel(RecordEntity.name) private recordEntityModel: Model<RecordEntityDocument>
	) { }

	async createParentDocument(data: UploadedFile): Promise<string> {
		const createdFile = new this.uploadedFileModel(data)
		const savedFile = await createdFile.save()
		return savedFile._id.toString()
	}

	async createRecordsBatch(parentId: string, records: Record<string, unknown>[]): Promise<void> {
		if (!records.length) return;

		const batchSize = 50000;

		const session = await this.recordEntityModel.db.startSession();
		session.startTransaction();

		try {
			for (let start = 0; start < records.length; start += batchSize) {
				const batch = records.slice(start, start + batchSize);

				const recordEntities = batch.map((record) => ({
					uploadedFileId: parentId,
					data: record,
				}));

				await this.recordEntityModel.insertMany(recordEntities, {
					session,
					ordered: true
				});
			}

			await session.commitTransaction();
		} catch (error) {
			await session.abortTransaction();
			throw new Error(`Failed to insert records batch: ${error.message}`);
		} finally {
			await session.endSession();
		}
	}


	async getRecordsByParentId({
		parentId,
		page,
		docsPerPage,
		limit = 100,
		filter,
	}: GetDocRequestDto & { parentId: string }): Promise<GetDocResponseDto[]> {
		const filterQuery = parseFilterString<RecordEntity>(filter)

		const query = {
			uploadedFileId: parentId,
			...filterQuery,
		}

		let findQuery = this.recordEntityModel.find(query).select('data').select('data -_id').lean()

		if (page && docsPerPage) {
			const skip = (page - 1) * docsPerPage
			findQuery = findQuery.skip(skip).limit(Math.min(docsPerPage, limit))
		} else {
			findQuery = findQuery.limit(limit)
		}

		const data = await findQuery.exec()

		return data.map((doc) => doc.data)
	}
}
