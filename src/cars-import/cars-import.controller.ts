import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class CarsImportController {
  @EventPattern('get_chunk')
  async getCarListChunk(data: any) {
    return console.log(data);
  }
}
