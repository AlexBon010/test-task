import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LogsService } from './logs/logs.service';
import { LogsController } from './logs/logs.controller';
import { ElasticsearchDbModule } from '@db';
import { FetchingLogsController } from './fetching-logs/fetching-logs.controller';
import { FetchingLogsService } from './fetching-logs/fetching-logs/fetching-logs.service';
import { ConfigsService } from '@cfg';

@Global()
@Module({
    imports: [
        ElasticsearchDbModule,
        ClientsModule.registerAsync([
            {
                name: 'LOGS_SERVICE',
                inject: [ConfigsService],
                useFactory: (configsService: ConfigsService) => ({
                    ...configsService.kafkaConfig(),
                    transport: Transport.KAFKA,
                }),
            },
        ]),
    ],
    controllers: [LogsController, FetchingLogsController],
    providers: [LogsService, FetchingLogsService],
})
export class LogsModule { }
