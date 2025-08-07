import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { LogsService } from '@messaging'
import { ApiEventsService } from '@db'

@Injectable()
export class LogsMiddleware implements NestMiddleware {
	constructor(private readonly logsService: LogsService, private readonly apiEventsService: ApiEventsService) { }

	use(req: Request, res: Response, next: NextFunction) {
		const start = Date.now();
		const { method, originalUrl } = req

		res.on('finish', () => {
			const status = res.statusCode

			const duration = Date.now() - start;
			const preparedUrl = originalUrl.split('?')[0]

			const logMessage = `${method} ${originalUrl}`

			void this.apiEventsService.recordResponseTime(preparedUrl, method, duration)

			if (status >= 400) {
				this.logsService.error(logMessage)
				next()
			}
			this.logsService.info(logMessage)
			next()
		})

		next()
	}
}
