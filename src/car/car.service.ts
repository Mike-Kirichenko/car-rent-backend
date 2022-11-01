import { Injectable } from '@nestjs/common';
import { QueryBuilder } from 'src/common/queryBuilder';
import { formatDate } from 'src/common/helpers';
import { ConfigService } from '@nestjs/config';

interface CarReport {
  readonly name: string;
  readonly carId: number;
  readonly daysInMonth: number;
  readonly LP: string;
}

interface CarReportWithDaysPrc extends CarReport {
  readonly name: string;
  readonly carId: number;
  readonly daysInMonth: number;
  readonly LP: string;
  percentInMonth: number;
}

@Injectable()
export class CarService {
  constructor(
    private queryBuilder: QueryBuilder,
    private config: ConfigService,
  ) {}

  async checkAvaliability(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;

    const dateFromFinalDate = new Date(dateFrom);
    const dateFromDiff = dateFromFinalDate.getDate() + 3;
    dateFromFinalDate.setDate(dateFromDiff);

    const dateToFinalDate = new Date(dateTo);
    const dateToDiff = dateToFinalDate.getDate() + 3;
    dateToFinalDate.setDate(dateToDiff);

    const query = `SELECT * FROM car WHERE id NOT IN (SELECT "rent_list"."carId" FROM rent_list 
    WHERE "rent_list"."dateFrom" <= '${formatDate(dateFromFinalDate)}' 
    AND "rent_list"."dateTo" <= '${formatDate(dateToFinalDate)}')`;

    const avaliableCars = await this.queryBuilder.runQuery(query);
    if (id) {
      const avaliableCarIndex = avaliableCars.findIndex(
        (car: { id: number; name: string; LP: string }) => car.id === id,
      );
      return { carId: id, avaliable: avaliableCarIndex > -1 };
    }
    return avaliableCars;
  }

  private getCarWithDaysInMonth(
    cars: [...any],
    daysInMonth: number,
    monthStart: Date,
    monthEnd: Date,
  ) {
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const carsWithdaysInMonth = cars.map(
      (car: {
        rentalId: number;
        carId: number;
        LP: string;
        dateFrom: Date;
        dateTo: Date;
      }) => {
        let dateDiff: number;
        const dateTo: Date = new Date(car.dateTo);
        const dateFrom: Date = new Date(car.dateFrom);
        if (dateTo.getMonth() != dateFrom.getMonth()) {
          if (dateTo >= monthStart && dateTo < monthEnd) {
            dateDiff = dateTo.getDate() - monthStart.getDate();
          } else dateDiff = daysInMonth - dateFrom.getDate();
        } else {
          dateDiff = (dateTo.valueOf() - dateFrom.valueOf()) / ONE_DAY_IN_MS;
        }
        return {
          rentalId: car.rentalId,
          carId: car.carId,
          daysInMonth: dateDiff,
          LP: car.LP,
        };
      },
    );
    return carsWithdaysInMonth;
  }

  private getRentedCarsGrouped(cars: [...any]) {
    const grouped = new Object();
    cars.forEach((car: CarReport) => {
      if (!grouped[car.carId]) {
        grouped[car.carId] = car;
      } else {
        grouped[car.carId].daysInMonth += car.daysInMonth;
      }
    });
    return Object.values(grouped);
  }

  async checkAvgCarEmployment(dto: { id: number; month: string }) {
    const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
    const { id, month } = dto;
    const [year, monthNum] = month.split('-');

    //get month's first and last day
    const startDate = new Date(`${year}-${monthNum}-01`);
    const endDate = new Date(`${year}-${Number(monthNum) + 1}-01`);

    //get correct dates
    const monthStart: string = formatDate(startDate);
    const monthEnd: string = formatDate(endDate);
    const monthStartObj = new Date(startDate);
    const monthEndObj = new Date(endDate);
    const daysInMonth: number =
      (monthEndObj.valueOf() - monthStartObj.valueOf()) / ONE_DAY_IN_MS;

    const employedCarsQuery = `SELECT "rent_list"."carId", rent_list.id AS "rentalId", "car"."LP", 
    "rent_list"."dateFrom" AT TIME ZONE 'GMT' AT TIME ZONE '${this.config.get(
      'TZ',
    )}' AS "dateFrom", 
    "rent_list"."dateTo" AT TIME ZONE 'GMT' AT TIME ZONE '${this.config.get(
      'TZ',
    )}' AS "dateTo" FROM rent_list 
   RIGHT JOIN car ON "car"."id" = "rent_list"."carId"
    WHERE ("rent_list"."dateFrom" <'${monthEnd}' AND "rent_list"."dateTo" >='${monthStart}') 
   ${id ? `AND "rent_list"."carId" = ${id}` : ''}`;

    const unemployedCarsQuery = `SELECT "car"."id" AS "carId", 
    0 AS "daysInMonth", "car"."LP", 
    0 AS "percentInMonth" FROM car 
    WHERE "car"."id" NOT IN (SELECT "rent_list"."carId" FROM rent_list 
    WHERE "rent_list"."dateFrom" <'${monthEnd}' 
    AND "rent_list"."dateTo" >= '${monthStart}')`;

    const monthEmpCars = await this.queryBuilder.runQuery(employedCarsQuery);
    const unemployedCars = await this.queryBuilder.runQuery(
      unemployedCarsQuery,
    );

    const carsWithdaysInMonth = this.getCarWithDaysInMonth(
      monthEmpCars,
      daysInMonth,
      monthStartObj,
      monthEndObj,
    );

    const rentedCarsGrouped = this.getRentedCarsGrouped(carsWithdaysInMonth);
    const rntCarsWithUsgPrct = rentedCarsGrouped.map((car) => ({
      carId: car.carId,
      daysInMonth: car.daysInMonth,
      LP: car.LP,
      percentInMonth: Math.round((car.daysInMonth / daysInMonth) * 100),
    }));

    const finalData = id
      ? rntCarsWithUsgPrct.find(
          (car: CarReportWithDaysPrc) => car.carId === id,
        ) ||
        unemployedCars.find((car: CarReport) => car.carId === id) ||
        {}
      : rntCarsWithUsgPrct.concat(unemployedCars);

    return finalData;
  }
}
