import { Controller, Param, Get } from '@nestjs/common';
import { CarService } from './car.service';
import { GetCarsInfoDto } from './dto';

@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}

  @Get('/stats/:month/:id?')
  getCarStats(@Param() dto: GetCarsInfoDto) {
    return this.carService.checkAvgCarEmployment(dto);
  }
}
