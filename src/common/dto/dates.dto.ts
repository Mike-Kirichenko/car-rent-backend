import { IsDateString } from 'class-validator';

export class DatesDto {
  @IsDateString()
  dateFrom: Date;

  @IsDateString()
  dateTo: Date;
}
