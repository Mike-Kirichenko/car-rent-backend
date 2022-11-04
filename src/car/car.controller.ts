import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Param, Get } from '@nestjs/common';
import { CarService } from './car.service';
import { GetCarsInfoDto } from './dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}

  @Get('/stats/:month/:id?')
  @ApiResponse({
    status: 200,
    description: `Returns usage statistics for car(s) by month. 
    If car's not found by id empty object is returned. If id's not passed returns stats for all cars by passed month`,
  })
  @ApiResponse({
    status: 400,
    description: `Return error message if invalid month is passed`,
  })
  getCarStats(@Param() dto: GetCarsInfoDto) {
    return this.carService.checkAvgCarEmployment(dto);
  }
}
