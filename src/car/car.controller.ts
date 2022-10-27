import { Controller, Param, Get } from '@nestjs/common';
import { DatesDto, IdDto } from '../common/dto';
import { GetCarsInfoDto } from './dto';

@Controller('cars')
export class CarController {
  @Get('/avaliability/:id?/:dateFrom/:dateTo')
  checkAvailability(@Param() idDto: IdDto, @Param() dto: DatesDto) {
    const { id } = idDto;
    const { dateFrom, dateTo } = dto;
    return {
      msg: `I'll check ${
        id ? `car #${id}` : 'cars'
      } availability from: ${dateFrom} to: ${dateTo}`,
    };
  }

  @Get('/stats/:id?/:month')
  getCarStats(@Param() dto: GetCarsInfoDto) {
    const { id, month } = dto;
    return {
      msg: `I'll send ${id ? `car #${id}` : 'cars'} stats for ${month} month`,
    };
  }
}
