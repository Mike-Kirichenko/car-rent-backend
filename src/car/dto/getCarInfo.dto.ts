import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class GetCarsInfoDto {
  @ApiProperty()
  @Matches('^([0-9]{4})-((0[1-9])|(1[0-2]))$')
  month: string;
}
