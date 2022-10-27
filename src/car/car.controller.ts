import { Controller, Param, Get } from '@nestjs/common';
import { GetCarsInfoDto, CarsAvaliableDto } from './dto';

@Controller('cars')
export class CarController {
  @Get('/avaliability/:dateFrom/:dateTo/:id?')
  checkAvailability(@Param() dto: CarsAvaliableDto) {
    const { id, dateFrom, dateTo } = dto;
    return {
      msg: `I'll check ${
        id ? `car #${id}` : 'cars'
      } availability from: ${dateFrom} to: ${dateTo}`,
    };
  }

  @Get('/stats/:month/:id?')
  getCarStats(@Param() dto: GetCarsInfoDto) {
    const { id, month } = dto;
    return {
      msg: `I'll send ${id ? `car #${id}` : 'cars'} stats for ${month}`,
    };
  }
}
