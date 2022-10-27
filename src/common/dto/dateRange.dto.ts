import { IsDateString } from 'class-validator';

export class DateRangeDto {
  @IsDateString()
  dateFrom: Date;

  @IsDateString()
  dateTo: Date;
}
