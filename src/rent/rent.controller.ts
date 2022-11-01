import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { CarsAvaliableDto, IdDto, DatesDto } from 'src/common/dto';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}
  @Get('/info/:dateFrom/:dateTo/:id')
  getPreCheckoutInfo(@Param() dto: CarsAvaliableDto) {
    return this.rentService.countRentalPrice(dto);
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
