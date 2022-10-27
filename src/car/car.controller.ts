import { Body, Controller, Param, Post } from '@nestjs/common';
import { DateRangeDto } from '../common/dto/dateRange.dto';

@Controller('cars')
export class CarController {
  @Post('/avaliable/:id?')
  checkAvailability(@Param('id') id: number, @Body() dto: DateRangeDto) {
    const { dateFrom, dateTo } = dto;
    return {
      msg: `I'll check ${
        id ? `car #${id}` : 'cars'
      } availability from: ${dateFrom} to: ${dateTo}`,
    };
  }

  @Post('/stats/:id?')
  getCarStats(@Param('id') id: number, @Body('month') month: number) {
    return {
      msg: `I'll send ${id ? `car #${id}` : 'cars'} stats for ${month} month`,
    };
  }
}
