import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { IdDto } from 'src/common/dto/id.dto';

export class GetCarsInfoDto extends IdDto {
  @IsInt()
  @Type(() => Number)
  month: number;
}
