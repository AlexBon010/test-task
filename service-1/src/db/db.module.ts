import { Module } from '@nestjs/common'

import { MongodbModule } from './mongodb/mongodb.module'
import { RedistimeseriesModule } from './redistimeseries/redistimeseries.module'

@Module({
	imports: [MongodbModule, RedistimeseriesModule],
})
export class DbModule {}
