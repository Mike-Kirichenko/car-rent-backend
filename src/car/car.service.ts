import { Injectable } from '@nestjs/common';
import { QueryBuilder } from 'src/common/queryBuilder';

@Injectable()
export class CarService {
  constructor(private queryBuilder: QueryBuilder) {}
  async checkAvaliability(dto: { id: number; dateFrom: Date; dateTo: Date }) {
    const { id, dateFrom, dateTo } = dto;
    const dateToFinalDate = new Date(dateTo);
    const deff = dateToFinalDate.getDate() + 3;
    dateToFinalDate.setDate(deff);
    const query = `SELECT "carId" FROM rent_list WHERE 'rent_list.dateFrom' >= '${dateFrom}' AND 'rent_list.dateTo' <= '${dateToFinalDate}'`;
    const rentedCars = await this.queryBuilder.runQuery(query);
    if (rentedCars) {
      if (id) {
        const rentedIndex = rentedCars.findIndex(
          (rentedCar: { carId: number }) => rentedCar.carId == id,
        );
        return rentedIndex > -1
          ? { carId: id, avaliable: false }
          : { carId: id, avaliable: true };
      } else {
        const rentedCarIds = rentedCars
          .map((rentedCar: { carId: number }) => rentedCar.carId)
          .join(',');
        const query = `SELECT * FROM car WHERE id NOT IN (${rentedCarIds})`;
        return await this.queryBuilder.runQuery(query);
      }
    }
  }
}
