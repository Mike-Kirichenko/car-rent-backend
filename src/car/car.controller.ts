import { Body, Controller, Param, Post } from '@nestjs/common';

@Controller('cars')
export class CarController {
  @Post('/avaliable/:id?')
  checkAvailability(
    @Param('id') id: number,
    @Body('dateRange') dateRange: { from: string; to: string },
  ) {
    const { from, to } = dateRange;
    return {
      msg: `I'll check ${
        id ? `car #${id}` : 'cars'
      } availability from: ${from} to: ${to}`,
    };
  }

  @Post('/stats/:id?')
  getCarStats(@Param('id') id: number, @Body('month') month: number) {
    return {
      msg: `I'll send ${id ? `car #${id}` : 'cars'} stats for ${month} month`,
    };
  }
}
