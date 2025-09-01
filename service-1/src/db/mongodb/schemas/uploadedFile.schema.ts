import { ObjectId } from 'mongodb'

export enum FileType {
	JSON = 'json',
	XLSX = 'xlsx',
	XLS = 'xls',
}

export interface UploadedFile {
	_id?: ObjectId
	originalFileName: string
	fileType: FileType
}
