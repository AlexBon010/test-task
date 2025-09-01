import { Filter } from 'mongodb'

interface ParseFilterStringResult {
	$and?: Filter<unknown>[]
}

export const parseFilterString = (filterStr?: string): ParseFilterStringResult => {
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
			if (!field || !operator || !value) return null

			const fieldPath = `data.${field.trim()}`
			const parsedValue = isNaN(Number(value.trim())) ? value.trim() : Number(value.trim())

			return operatorsMap[operator]
				? { [fieldPath]: { [operatorsMap[operator]]: parsedValue } }
				: { [fieldPath]: parsedValue }
		})
		.filter(Boolean) as Filter<unknown>[]

	return { $and: conditions }
}
