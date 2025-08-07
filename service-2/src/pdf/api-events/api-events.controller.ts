import { Controller, Get, Header, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiEventsService } from './api-events/api-events.service';

@ApiTags('API Events')
@Controller('apiEvents')
export class ApiEventsController {
    constructor(private readonly apiEventsService: ApiEventsService) { }

    @Get()
    @Header('Content-Type', 'application/pdf')
    @ApiOperation({ summary: 'Get API response time report as PDF' })
    @ApiResponse({ status: 200, description: 'Returns PDF report with response time statistics' })
    async getApiEventsReport(@Res() res: Response) {
        const buffer = await this.apiEventsService.generatePdfReport();
        const date = new Date().toISOString().split('T')[0];

        res.setHeader('Content-Disposition', `attachment; filename="api-response-time-report-${date}.pdf"`)
        res.setHeader('Content-Type', 'application/pdf')

        res.send(buffer)
    }
}
