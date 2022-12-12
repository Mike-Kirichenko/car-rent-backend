import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CarsImportService } from './cars-import.service';

@Controller()
export class CarsImportController {
  constructor(private carsImportService: CarsImportService) {}

  @EventPattern('get_chunk')
  async getCarListChunk(data: string[]) {
    this.carsImportService.writeCarsToDbByChunks(data);
  }
}
