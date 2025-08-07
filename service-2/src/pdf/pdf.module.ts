import { Module } from '@nestjs/common';

import { RedistimeseriesModule } from '@db';
import { ApiEventsController } from './api-events/api-events.controller';
import { ApiEventsService } from './api-events/api-events/api-events.service';

@Module({
  imports: [RedistimeseriesModule],
  controllers: [ApiEventsController],
  providers: [ApiEventsService]
})
export class PdfModule { }
