import { QueryBuilder } from '@classes/queryBuilder';
import { Module } from '@nestjs/common';
import { CarsImportController } from './cars-import.controller';
import { CarsImportService } from './cars-import.service';

@Module({
  controllers: [CarsImportController],
  providers: [CarsImportService, QueryBuilder],
})
export class CarsImportModule {}
