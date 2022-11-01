import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryBuilder } from 'src/common/queryBuilder';

@Injectable()
export class RentService {
  private basicPrice = 100;
  private ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
  private basicSale = 0.05;
  constructor(private queryBuilder: QueryBuilder) {}
  async countRentalPrice(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;
    const query = `SELECT id FROM car WHERE "car"."id"='${id}' LIMIT 1`;
    const foundCar: [{ id: number }] = await this.queryBuilder.runQuery(query);

    if (!foundCar.length) {
      throw new BadRequestException({
        msg: `car with id:${id} doesn't exist`,
      });
    }

    let sum = 0;
    const dayDiff: number =
      (new Date(dateTo).valueOf() - new Date(dateFrom).valueOf()) /
      this.ONE_DAY_IN_MS;
    for (let i = 1; i <= dayDiff; i++) {
      if (i >= 1 && i <= 4) {
        sum += this.basicPrice;
      } else if (i >= 5 && i <= 9) {
        sum += this.basicPrice - this.basicPrice * this.basicSale;
      } else if (i >= 10 && i <= 17) {
        sum += this.basicPrice - this.basicPrice * this.basicSale * 2;
      } else if (i >= 18 && i <= 29) {
        sum += this.basicPrice - this.basicPrice * this.basicSale * 3;
      }
    }
    return { carId: id, daysOfRental: dayDiff, cost: sum };
  }
}
