import { BadRequestException, Injectable } from '@nestjs/common';
import { formatDate, getDayDiff, isWeekEndDay } from 'src/common/helpers';
import { QueryBuilder } from 'src/common/classes/queryBuilder';

@Injectable()
export class RentService {
  private basicPrice = 100;
  private basicSale = 0.05;
  constructor(private queryBuilder: QueryBuilder) {}

  async checkAvaliability(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;
    const totalDays = getDayDiff(dateTo, dateFrom);

    if (totalDays > 30) {
      throw new BadRequestException({
        msg: `car can't be rented for more than 30 days`,
      });
    }

    if (isWeekEndDay(dateFrom) || isWeekEndDay(dateTo)) {
      throw new BadRequestException({
        msg: `car rental can't start or end on weekend day`,
      });
    }

    const dateFromWithDelay = new Date(dateFrom);
    const dateFromDiff = dateFromWithDelay.getDate() + 3;
    dateFromWithDelay.setDate(dateFromDiff);

    const dateToWithDelay = new Date(dateTo);
    const dateToDiff = dateToWithDelay.getDate() + 3;
    dateToWithDelay.setDate(dateToDiff);

    const query = `SELECT * FROM car WHERE id NOT IN 
    (
      SELECT "rent_list"."carId" AS "id" FROM rent_list 
      WHERE
      (
        "rent_list"."dateFrom" BETWEEN '${formatDate(
          dateFromWithDelay,
        )}' AND '${formatDate(dateToWithDelay)}'
        OR
        "rent_list"."dateTo" BETWEEN '${formatDate(
          dateFromWithDelay,
        )}' AND '${formatDate(dateToWithDelay)}'
      ) 
    )`;

    const avaliableCars = await this.queryBuilder.runQuery(query);
    if (id) {
      const avaliableCarIndex = avaliableCars.findIndex(
        (car: { id: number; name: string; LP: string }) => car.id === id,
      );
      return { carId: id, avaliable: avaliableCarIndex > -1 };
    }
    return avaliableCars;
  }

  private countRentalPrice(days: number): number {
    let sum = 0;
    if (days === 15) {
      sum +=
        4 * this.basicPrice +
        5 * (this.basicPrice - this.basicPrice * this.basicSale) +
        6 * (this.basicPrice - this.basicPrice * this.basicSale * 2);
    } else {
      for (let i = 1; i <= days; i++) {
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
    }

    return sum;
  }

  async getRentalPrice(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;
    const query = `SELECT id FROM car WHERE "car"."id"='${id}' LIMIT 1`;
    const foundCar: [{ id: number }] = await this.queryBuilder.runQuery(query);

    if (!foundCar.length) {
      throw new BadRequestException({
        msg: `car with id:${id} doesn't exist`,
      });
    }

    const daysOfRental: number = getDayDiff(dateTo, dateFrom);
    const cost: number = this.countRentalPrice(daysOfRental);

    return {
      carId: id,
      daysOfRental,
      cost,
    };
  }

  async checkout(
    idDto: { id: number },
    bodyDto: { dateFrom: Date; dateTo: Date },
  ) {
    const { id } = idDto;
    const { dateFrom, dateTo } = bodyDto;
    const carInfo = await this.checkAvaliability({ ...idDto, ...bodyDto });

    if (!carInfo.avaliable) {
      throw new BadRequestException(carInfo);
    }

    const totalDays = getDayDiff(dateTo, dateFrom);
    const totalPrice = this.countRentalPrice(totalDays);

    const query = `INSERT INTO rent_list ("carId", "dateFrom", "dateTo") VALUES ('${id}', '${dateFrom}', '${dateTo}')`;
    const newRental = await this.queryBuilder.runQuery(query);
    return newRental ? { success: true, totalPrice } : { success: false };
  }
}
