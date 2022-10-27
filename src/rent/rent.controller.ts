import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { DatesDto } from 'src/common/dto/dates.dto';
import { IdDto } from 'src/common/dto/id.dto';

@Controller('rent')
export class RentController {
  @Get('/info/:id/:dateFrom/:dateTo')
  getPreCheckoutInfo(@Param('id') idDto: IdDto, @Param() dto: DatesDto) {
    const { id } = idDto;
    const { dateFrom, dateTo } = dto;
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
