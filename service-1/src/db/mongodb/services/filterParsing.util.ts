import { FilterQuery } from 'mongoose'

interface ParseFilterStringResult<T> {
	$and?: FilterQuery<T>[]
}

export const parseFilterString = <T>(filterStr?: string): ParseFilterStringResult<T> => {
	if (!filterStr) return {}

	const operatorsMap: Record<string, string> = {
		'>': '$gt',
		'<': '$lt',
		'>=': '$gte',
		'<=': '$lte',
		'=': '',
	}

	const conditions = filterStr
		.split(',')
		.map((condition) => {
			const [, field, operator, value] = condition.match(/([^><!=]+)([><]=?|=)(.+)/) || []
			if (!field || !operator || !value) return []

			const fieldPath = `data.${field.trim()}`
			const parsedValue = isNaN(Number(value.trim())) ? value.trim() : Number(value.trim())

			return operatorsMap[operator]
				? { [fieldPath]: { [operatorsMap[operator]]: parsedValue } }
				: { [fieldPath]: parsedValue }
		})
		.filter(Boolean)

	return { $and: conditions as FilterQuery<T>[] }
}
