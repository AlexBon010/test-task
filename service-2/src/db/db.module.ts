import { Module } from '@nestjs/common';

import { RedistimeseriesModule } from './redistimeseries/redistimeseries.module';
import { ElasticsearchDbModule } from './elasticsearch/elasticsearchDb.module';

@Module({
  imports: [ElasticsearchDbModule, RedistimeseriesModule]
})
export class DbModule { }
