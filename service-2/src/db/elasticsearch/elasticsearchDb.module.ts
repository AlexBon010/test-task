import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";

import { ElasticsearchDbService } from './elasticsearch-db/elasticsearch-db.service';
import { ConfigsService } from "@cfg";

@Module({
    imports: [ElasticsearchModule.registerAsync({
        inject: [ConfigsService],
        useFactory: (configsService: ConfigsService) => {
            return configsService.elasticsearchConfig();
        },
    })],
    providers: [ElasticsearchDbService],
    exports: [ElasticsearchDbService],
})
export class ElasticsearchDbModule {
}