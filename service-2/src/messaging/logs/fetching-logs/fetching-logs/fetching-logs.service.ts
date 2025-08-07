import { Injectable } from '@nestjs/common';

import { ElasticsearchDbService } from '@db';
import { GetLogsDto } from '../dto/getLogs.dto';

@Injectable()
export class FetchingLogsService {
    constructor(private readonly elasticsearchDbService: ElasticsearchDbService) { }

    async getLogs(query: GetLogsDto) {
        return this.elasticsearchDbService.getLogs(query);
    }
}
