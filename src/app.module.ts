import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';

@Module({
  imports: [CarModule, RentModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule implements OnModuleInit {
  conn: any;
  constructor(private config: ConfigService) {
    this.conn = new Pool({
      user: this.config.get('DB_USER'),
      host: this.config.get('DB_HOST'),
      database: this.config.get('DB_NAME'),
      password: this.config.get('DB_PASSWORD'),
      port: this.config.get('DB_PORT'),
    });
  }
  async onModuleInit() {
    const carQuery = `CREATE TABLE IF NOT EXISTS "car" (
      id SERIAL PRIMARY KEY,
      name VARCHAR (50) NOT NULL,
      "LP" VARCHAR (10) UNIQUE NOT NULL
    )`;
    const rentListQuery = `CREATE TABLE IF NOT EXISTS "rent_list" (
      id SERIAL PRIMARY KEY,
      "carId" SMALLINT NOT NULL,
      "dateFrom" timestamp without time zone NOT NULL,
      "dateTo" timestamp without time zone NOT NULL,
      "totalPrice" double precision
    )`;
    try {
      console.log('migration');
      await this.conn.query(carQuery);
      await this.conn.query(rentListQuery);
    } catch ({ message: msg }) {
      console.log({ msg });
    }
  }
}
