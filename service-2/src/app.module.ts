import { Module } from '@nestjs/common';

import { DbModule } from '@db';
import { LogsModule } from '@messaging';
import { PdfModule } from './pdf/pdf.module';
import { CfgModule } from '@cfg';

@Module({
  imports: [CfgModule, DbModule, LogsModule, PdfModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
