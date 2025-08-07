import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

type LogKey = "response_time"

interface GetLogsAboutEndpointResponse {
    timestamp: number;
    value: number;
}

@Injectable()
export class LogsService {
    private readonly logger = new Logger(LogsService.name);

    constructor(@InjectRedis() private readonly redis: Redis) { }

    async getLogsAboutEndpoint(
        endpoint: string,
        key: LogKey,
    ): Promise<GetLogsAboutEndpointResponse[]> {
        try {
            const now = new Date();
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

            const composedKey = `logs:${endpoint}:${key}`;
            const result = await this.redis.call(
                'TS.RANGE',
                composedKey,
                monthAgo.getTime(),
                now.getTime()
            ) as [string, string][]

            return result.map(([ts, val]) => ({
                timestamp: parseInt(ts),
                value: parseFloat(val)
            }));

        } catch (error) {
            this.logger.error(`Error getting metric data about endpoint ${endpoint}: ${error.message}`, error.stack);
            return [];
        }
    }

}
