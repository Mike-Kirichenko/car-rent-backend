import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { DatesDto } from './dates.dto';

export class CarsAvaliableDto extends DatesDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  id: number;
}
