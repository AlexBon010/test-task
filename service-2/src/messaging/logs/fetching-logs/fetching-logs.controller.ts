import { Controller, Get, Query } from '@nestjs/common';

import { GetLogsDto } from './dto/getLogs.dto';
import { FetchingLogsService } from './fetching-logs/fetching-logs.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Logs')
@Controller('logs')
export class FetchingLogsController {
    constructor(private readonly fetchingLogsService: FetchingLogsService) { }

    @ApiOperation({
        summary: 'Get logs',
        description: 'Retrieve logs within a specified date range, filtered by log level with pagination'
    })
    @Get("fetching")
    getLogs(@Query() query: GetLogsDto) {
        return this.fetchingLogsService.getLogs(query);
    }

}
