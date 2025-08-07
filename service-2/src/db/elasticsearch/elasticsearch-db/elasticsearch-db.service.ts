import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ILog } from '@messaging';

interface LogQueryParams {
    startDate: string;
    endDate: string;
    level?: string;
    limit?: number;
}

@Injectable()
export class ElasticsearchDbService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async writeLog(log: ILog) {
        const dateIndex = new Date(log.timestamp).getTime();
        const levelIndex = log.level.toLowerCase();
        const composedIndex = `${levelIndex}-${dateIndex}`;

        const indexExists = await this.elasticsearchService.indices.exists({ index: composedIndex });
        if (!indexExists) {
            await this.elasticsearchService.indices.create({
                index: composedIndex,
                mappings: {
                    properties: {
                        '@timestamp': {
                            type: 'date',
                            format: 'strict_date_optional_time||epoch_millis'
                        },
                        level: {
                            type: 'keyword'
                        },
                        message: {
                            type: 'text'
                        },
                        service: {
                            type: 'keyword'
                        }
                    }
                }
            });
        }

        await this.elasticsearchService.index({
            index: composedIndex,
            document: {
                '@timestamp': new Date(log.timestamp).toISOString(),
                level: log.level,
                message: log.message,
                service: log.service,
            },
        });
    }
    async getLogs(params: LogQueryParams) {
        const {
            startDate,
            endDate,
            level = '*',
            limit = 30,
        } = params;

        const response = await this.elasticsearchService.search({
            index: `${level}-*`,
            size: limit,
            sort: [
                { '@timestamp': { order: 'desc' } }
            ],
            query: {
                range: {
                    '@timestamp': {
                        gte: new Date(startDate).toISOString(),
                        lte: new Date(endDate).toISOString(),
                    },
                },
            },
        });
        return response.hits.hits.map(hit => hit._source);
    }
}
