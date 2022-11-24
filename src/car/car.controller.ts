import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Param, Get, ParseIntPipe } from '@nestjs/common';
import { CarService } from './car.service';
import { GetCarsInfoDto } from './dto';

@ApiTags('Cars')
@Controller('cars')
export class CarController {
  constructor(private carService: CarService) {}

  @Get('/stats/:month/:id')
  @ApiResponse({
    status: 200,
    description: `Returns usage statistics for car by month. 
    If car's not found by id empty object is returned.`,
  })
  @ApiResponse({
    status: 400,
    description: `Return error message if invalid month is passed`,
  })
  getCarStats(
    @Param() dto: GetCarsInfoDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.carService.checkAvgCarEmployment({ month: dto.month, id });
  }

  @Get('/stats/:month')
  @ApiResponse({
    status: 200,
    description: `Returns usage statistics for cars by month`,
  })
  @ApiResponse({
    status: 400,
    description: `Return error message if invalid month is passed`,
  })
  getCarsStats(@Param() dto: GetCarsInfoDto) {
    return this.carService.checkAvgCarEmployment(dto);
  }
}
