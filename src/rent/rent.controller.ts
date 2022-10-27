import { Body, Controller, Param, Post } from '@nestjs/common';
import { DateRangeDto } from 'src/common/dto/dateRange.dto';

@Controller('rent')
export class RentController {
  @Post('/info/:id')
  getPreCheckoutInfo(@Param('id') id: number, @Body() dto: DateRangeDto) {
    const { dateFrom, dateTo } = dto;
    return {
      msg: `I'll check how much it will cost to rent car #${id} from: ${dateFrom} to: ${dateTo}`,
    };
  }

  @Post('/checkout/:id')
  checkout(@Param('id') id: number, @Body() dto: DateRangeDto) {
    const { dateFrom, dateTo } = dto;
    return {
      msg: `I'll checkout car #${id} from: ${dateFrom} to: ${dateTo}`,
    };
  }
}
