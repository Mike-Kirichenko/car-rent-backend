import { Body, Controller, Param, Post } from '@nestjs/common';

@Controller('rent')
export class RentController {
  @Post('/info/:id')
  getPreCheckoutInfo(
    @Param('id') id: number,
    @Body('dateRange') dateRange: { from: string; to: string },
  ) {
    const { from, to } = dateRange;
    return {
      msg: `I'll check how much it will cost to rent car #${id} from: ${from} to: ${to}`,
    };
  }

  @Post('/checkout/:id')
  checkout(
    @Param('id') id: number,
    @Body('dateRange') dateRange: { from: string; to: string },
  ) {
    const { from, to } = dateRange;
    return {
      msg: `I'll checkout car #${id} from: ${from} to: ${to}`,
    };
  }
}
