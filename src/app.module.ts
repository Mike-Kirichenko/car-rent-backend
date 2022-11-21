import { Pool } from 'pg';
import { Module, OnModuleInit } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  formatDate,
  getDayDiff,
  isWeekEndDay,
  countRentalPrice,
} from './common/helpers';
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

  private async seed() {
    const carTestData = [];
    const rentListData = [];

    let carsQueryString = `INSERT INTO car (name, "LP") VALUES `;
    let rentalQueryString = `INSERT INTO "rent_list" ("carId", "dateFrom", "dateTo", "totalPrice") VALUES `;

    for (let i = 0; i < 20; i++) {
      const carObject = {
        name: faker.vehicle.vehicle(),
        LP: faker.vehicle.vrm(),
      };
      carTestData.push(carObject);
    }

    while (rentListData.length < 500) {
      let [dateFrom, dateTo] = faker.date.betweens(
        '2017-01-01T00:00:00.000Z',
        `${new Date().getFullYear()}-01-01T00:00:00.000Z`,
      );

      dateFrom = new Date(formatDate(dateFrom));
      dateTo = new Date(formatDate(dateTo));
      if (!isWeekEndDay(dateFrom) && !isWeekEndDay(dateTo)) {
        const totalDays = getDayDiff(dateTo, dateFrom);
        if (totalDays > 0 && totalDays <= 30) {
          const id = Math.floor(Math.random() * 20) + 1;
          const foundCarIndex = rentListData.findIndex((el) => el.id === id);

          if (foundCarIndex > -1) {
            const dateFromWithDelay = dateFrom;
            const dateFromDiff = dateFromWithDelay.getDate() - 3;
            dateFromWithDelay.setDate(dateFromDiff);

            const dateToWithDelay = dateTo;
            const dateToDiff = dateToWithDelay.getDate() + 3;
            dateToWithDelay.setDate(dateToDiff);

            if (
              !(rentListData[foundCarIndex].dateFrom >= dateFromWithDelay) &&
              !(rentListData[foundCarIndex].dateFrom <= dateToWithDelay) &&
              !(rentListData[foundCarIndex].dateTo >= dateFromWithDelay) &&
              !(rentListData[foundCarIndex].dateFrom <= dateToWithDelay)
            ) {
              rentListData.push({
                carId: id,
                dateFrom,
                dateTo,
                totalPrice: countRentalPrice(totalDays),
              });
            }
          } else {
            rentListData.push({
              carId: id,
              dateFrom,
              dateTo,
              totalPrice: countRentalPrice(totalDays),
            });
          }
        }
      }
    }

    carTestData.forEach((car) => {
      carsQueryString += `('${car.name}', '${car.LP}'),`;
    });

    rentListData.forEach((rental) => {
      rentalQueryString += `('${rental.carId}', '${formatDate(
        rental.dateFrom,
      )}', '${formatDate(rental.dateTo)}', '${rental.totalPrice}'),`;
    });

    carsQueryString = carsQueryString.substring(0, carsQueryString.length - 1);
    rentalQueryString = rentalQueryString.substring(
      0,
      rentalQueryString.length - 1,
    );

    await this.conn.query(carsQueryString);
    await this.conn.query(rentalQueryString);
  }

  async onModuleInit() {
    const carQuery = `CREATE TABLE IF NOT EXISTS "car" (
      id SERIAL PRIMARY KEY,
      name VARCHAR (50) NOT NULL,
      "LP" VARCHAR (7) UNIQUE NOT NULL
    )`;
    const rentListQuery = `CREATE TABLE IF NOT EXISTS "rent_list" (
      id SERIAL PRIMARY KEY,
      "carId" SMALLINT NOT NULL,
      "dateFrom" timestamp without time zone NOT NULL,
      "dateTo" timestamp without time zone NOT NULL,
      "totalPrice" double precision
    )`;
    try {
      await this.conn.query(carQuery);
      await this.conn.query(rentListQuery);
      await this.seed();
    } catch ({ message: msg }) {
      console.log({ msg });
    }
  }
}
