import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { CarsAvaliableDto, IdDto, DatesDto } from 'src/common/dto';
import { RentService } from './rent.service';

@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @Get('/avaliability/:dateFrom/:dateTo/:id?')
  checkAvailability(@Param() dto: CarsAvaliableDto) {
    return this.rentService.checkAvaliability(dto);
  }

  @Get('/info/:dateFrom/:dateTo/:id')
  getPreCheckoutInfo(@Param() dto: CarsAvaliableDto) {
    return this.rentService.getRentalPrice(dto);
  }

  @Post('/checkout/:id')
  checkout(@Param() idDto: IdDto, @Body() bodyDto: DatesDto) {
    return this.rentService.checkout(idDto, bodyDto);
  }
}
