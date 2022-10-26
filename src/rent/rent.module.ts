import { Module } from '@nestjs/common';
import { RentController } from './rent.controller';

@Module({
  controllers: [RentController],
})
export class RentModule {}
