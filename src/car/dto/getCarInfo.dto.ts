import { Matches } from 'class-validator';
import { IdDto } from 'src/common/dto/id.dto';

export class GetCarsInfoDto extends IdDto {
  @Matches('^((0[1-9])|(1[0-2]))-([0-9]{4})$')
  month: string;
}
