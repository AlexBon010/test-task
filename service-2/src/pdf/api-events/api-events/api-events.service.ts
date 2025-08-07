import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { LogsService } from '@db';
import { responseTimeTemplate } from 'src/pdf/templates/response-time';

interface MetricDataPoint {
    timestamp: number;
    value: number;
}

@Injectable()
export class ApiEventsService {
    constructor(private readonly logsService: LogsService) { }

    async generatePdfReport() {
        const data: MetricDataPoint[] = await this.logsService.getLogsAboutEndpoint(
            'GET:/api/files/getDataInFile',
            'response_time'
        );
        const htmlContent = this.generateHtml(data);

        const browser = await puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return pdfBuffer;
    }

    private generateHtml(data: MetricDataPoint[]): string {
        if (!data || data.length === 0) {
            return responseTimeTemplate(0, 0, 0, [], []);
        }

        let sum = 0;
        let max = data[0].value;
        let min = data[0].value;

        const labels: string[] = [];
        const values: number[] = [];

        data.forEach(({ value, timestamp }) => {
            sum += value;
            if (value > max) max = value;
            if (value < min) min = value;

            labels.push(new Date(timestamp).toDateString());
            values.push(Number(value));
        });

        const avg = sum / data.length;

        return responseTimeTemplate(avg, max, min, labels, values);
    }

}
