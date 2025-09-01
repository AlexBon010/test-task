import { MongoClient, Db } from 'mongodb'
import { ConfigsService } from '@cfg'

export const mongodbProvider = {
    provide: 'MONGODB_CONNECTION',
    useFactory: async (configService: ConfigsService): Promise<Db> => {
        const connectionString = configService.mongoConfig()
        const client = new MongoClient(connectionString)
        await client.connect()
        return client.db()
    },
    inject: [ConfigsService],
}
