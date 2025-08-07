import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumber, IsOptional, Min } from "class-validator";

export enum LogLevel {
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export class GetLogsDto {
    @ApiProperty({ description: 'Start date', example: '2025-01-01' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ description: 'End date', example: '2026-01-01' })
    @IsDateString()
    endDate: string;

    @ApiProperty({ description: 'Level', example: LogLevel.INFO })
    @IsEnum(LogLevel)
    level: string;

    @ApiProperty({ description: 'Limit', example: 10, required: false })
    @IsNumber()
    @Min(1)
    @IsOptional()
    limit?: number;
}