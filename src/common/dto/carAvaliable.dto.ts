import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { DatesDto } from 'src/common/dto';

export class CarsAvaliableDto extends DatesDto {
  @ApiProperty({ required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}
