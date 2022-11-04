import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class IdDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  id: number;
}
