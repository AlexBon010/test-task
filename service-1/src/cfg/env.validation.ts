import { plainToInstance } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
	@IsNotEmpty()
	@IsNumber()
	SERVICE_1_PORT: number

	@IsNotEmpty()
	@IsNumber()
	MONGODB_PORT: number

	@IsNotEmpty()
	@IsString()
	MONGODB_HOST: string

	@IsNotEmpty()
	@IsNumber()
	REDIS_PORT: number

	@IsNotEmpty()
	@IsString()
	REDIS_HOST: string

	@IsNotEmpty()
	@IsNumber()
	KAFKA_PORT: number

	@IsNotEmpty()
	@IsString()
	KAFKA_HOST: string
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	})
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	})

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}

	return validatedConfig
}
