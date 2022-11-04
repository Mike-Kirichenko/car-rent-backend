import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Get, Post } from '@nestjs/common';
import { CarsAvaliableDto, DatesDto } from 'src/common/dto';
import { RentService } from './rent.service';
import { IdDto } from './dto/id.dto';

@ApiTags('Rental')
@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @Get('/avaliability/:dateFrom/:dateTo/:id?')
  @ApiResponse({
    status: 200,
    description: `In case if id is passed checks and returns answer on question: If car found by specified id is avaliable in given date range. 
    Otherwise returns all avaliable cars in same range`,
  })
  @ApiResponse({
    status: 400,
    description: `Returns error message if invalid date range is passed`,
  })
  checkAvailability(@Param() dto: CarsAvaliableDto) {
    return this.rentService.checkAvaliability(dto);
  }

  @Get('/info/:dateFrom/:dateTo/:id')
  @ApiResponse({
    status: 200,
    description: `Calculates how much will it cost to rent a car found by id within given date range`,
  })
  @ApiResponse({
    status: 400,
    description: `Returns error message if invalid date range is passed`,
  })
  @ApiResponse({
    status: 404,
    description: `Returns error message in case if requested car doesn't exist`,
  })
  getPreCheckoutInfo(@Param() dto: CarsAvaliableDto) {
    return this.rentService.getRentalPrice(dto);
  }

  @Post('/checkout/:id')
  @ApiResponse({
    status: 201,
    description: `Creates and returns a new car rental record where carId, dateFrom and totalPrice is presented`,
  })
  @ApiResponse({
    status: 400,
    description: `Returns error message if invalid date range is passed`,
  })
  @ApiBody({ type: DatesDto })
  checkout(@Param() idDto: IdDto, @Body() bodyDto: DatesDto) {
    return this.rentService.checkout(idDto, bodyDto);
  }
}
