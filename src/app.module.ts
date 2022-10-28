import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [CarModule, RentModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
