import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Matches, IsInt, IsOptional } from 'class-validator';

export class GetCarsInfoDto {
  @ApiProperty()
  @Matches('^([0-9]{4})-((0[1-9])|(1[0-2]))$')
  month: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}
