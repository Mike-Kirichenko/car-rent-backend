import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [CarModule, RentModule],
})
export class AppModule {}
