import { Controller, Param, Get } from '@nestjs/common';
import { CarService } from './car.service';
import { GetCarsInfoDto, CarsAvaliableDto } from './dto';

@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}
  @Get('/avaliability/:dateFrom/:dateTo/:id?')
  checkAvailability(@Param() dto: CarsAvaliableDto) {
    return this.carService.checkAvaliability(dto);
  }

  @Get('/stats/:month/:id?')
  getCarStats(@Param() dto: GetCarsInfoDto) {
    return this.carService.checkAvgCarEmployment(dto);
  }
}
