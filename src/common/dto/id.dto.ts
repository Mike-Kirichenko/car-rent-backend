import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class IdDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}
