import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CarsImpExpService } from './carsImpExp.service';

@Controller()
export class CarsImpExpController {
  constructor(private carsImpExpService: CarsImpExpService) {}

  @EventPattern('get_chunk')
  async getCarListChunk(data: string[]) {
    this.carsImpExpService.writeCarsToDbByChunks(data);
  }

  @EventPattern('export_list')
  async exportCars() {
    return await this.carsImpExpService.exportCarsList();
  }
}
