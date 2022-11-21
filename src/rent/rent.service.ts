import { BadRequestException, Injectable, HttpException } from '@nestjs/common';
import {
  formatDate,
  getDayDiff,
  isWeekEndDay,
  countRentalPrice,
} from 'src/common/helpers';
import { QueryBuilder } from 'src/common/classes/queryBuilder';

@Injectable()
export class RentService {
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
    const dateFromDiff = dateFromWithDelay.getDate() - 3;
    dateFromWithDelay.setDate(dateFromDiff);

    const dateToWithDelay = new Date(dateTo);
    const dateToDiff = dateToWithDelay.getDate() + 3;
    dateToWithDelay.setDate(dateToDiff);

    const query = `SELECT * FROM car WHERE id NOT IN 
    (
      SELECT "rent_list"."carId" FROM rent_list 
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

  async getRentalPrice(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;
    const query = `SELECT id FROM car WHERE "car"."id"='${id}' LIMIT 1`;
    const foundCar: [{ id: number }] = await this.queryBuilder.runQuery(query);

    if (!foundCar.length) {
      throw new HttpException(`car with id:${id} doesn't exist`, 404);
    }

    const daysOfRental: number = getDayDiff(dateTo, dateFrom);

    if (daysOfRental < 0) {
      throw new BadRequestException({
        msg: `Invalid dates range`,
      });
    }

    const cost: number = countRentalPrice(daysOfRental);

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

    if (totalDays < 0) {
      throw new BadRequestException({
        msg: `Invalid dates range`,
      });
    }

    const totalPrice = countRentalPrice(totalDays);

    const query = `INSERT INTO rent_list ("carId", "dateFrom", "dateTo", "totalPrice") VALUES ('${id}', '${dateFrom}', '${dateTo}', ${totalPrice})`;
    const newRental = await this.queryBuilder.runQuery(query);
    return newRental ? { success: true, totalPrice } : { success: false };
  }
}
