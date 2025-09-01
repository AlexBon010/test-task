import Redis from 'ioredis'
import { ConfigsService } from '@cfg'

export const redisProvider = {
    provide: 'REDIS_CONNECTION',
    useFactory: async (configService: ConfigsService): Promise<Redis> => {
        const connectionString = configService.redisConfig()
        const redis = new Redis(connectionString)
        await new Promise((resolve, reject) => {
            redis.on('ready', resolve)
            redis.on('error', reject)
        })

        return redis
    },
    inject: [ConfigsService],
}
