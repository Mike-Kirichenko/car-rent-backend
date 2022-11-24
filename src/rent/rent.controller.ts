import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CarsAvaliableDto, DatesDto } from './dto';
import { RentService } from './rent.service';

@ApiTags('Rental')
@Controller('rent')
export class RentController {
  constructor(private rentService: RentService) {}

  @Get('/avaliability/:dateFrom/:dateTo/:id')
  @ApiResponse({
    status: 200,
    description: `Returns answer object if car found by specified id is avaliable in given date range.`,
  })
  @ApiResponse({
    status: 400,
    description: `Returns error message if invalid date range is passed`,
  })
  checkAvailability(@Param() dto: CarsAvaliableDto) {
    return this.rentService.checkAvaliability(dto);
  }

  @Get('/car-list/:dateFrom/:dateTo')
  @ApiResponse({
    status: 200,
    description: `Returns list of cars that are avaliable in given date range.`,
  })
  @ApiResponse({
    status: 400,
    description: `Returns error message if invalid date range is passed`,
  })
  checkAllAvaliable(@Param() dto: DatesDto) {
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
  checkout(@Param('id', ParseIntPipe) id: number, @Body() bodyDto: DatesDto) {
    return this.rentService.checkout({
      id,
      dateFrom: bodyDto.dateFrom,
      dateTo: bodyDto.dateTo,
    });
  }
}
