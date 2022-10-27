import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { CarsAvaliableDto, IdDto, DatesDto } from 'src/common/dto';

@Controller('rent')
export class RentController {
  @Get('/info/:dateFrom/:dateTo/:id')
  getPreCheckoutInfo(@Param() dto: CarsAvaliableDto) {
    const { id, dateFrom, dateTo } = dto;
    return {
      msg: `I'll check how much it will cost to rent car #${id} from: ${dateFrom} to: ${dateTo}`,
    };
  }

  @Post('/checkout/:id')
  checkout(@Param() idDto: IdDto, @Body() bodyDto: DatesDto) {
    const { id } = idDto;
    const { dateFrom, dateTo } = bodyDto;
    return {
      msg: `I'll checkout car #${id} from: ${dateFrom} to: ${dateTo}`,
    };
  }
}
