import { MongoClient, Db } from 'mongodb'
import { ConfigsService } from '@cfg'

export const mongoClientProvider = {
    provide: 'MONGODB_CLIENT',
    useFactory: async (config: ConfigsService): Promise<MongoClient> => {
        const client = new MongoClient(config.mongoConfig())
        await client.connect()
        return client
    },
    inject: [ConfigsService],
}

export const mongodbProvider = {
    provide: 'MONGODB_CONNECTION',
    useFactory: (client: MongoClient): Db => client.db(),
    inject: ['MONGODB_CLIENT'],
}
