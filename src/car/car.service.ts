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
    const query = `SELECT * FROM car WHERE id NOT IN (SELECT "carId" FROM rent_list 
    WHERE 'rent_list.dateFrom' >= '${dateFrom}' 
    AND 'rent_list.dateTo' <= '${dateToFinalDate}')`;
    const avaliableCars = await this.queryBuilder.runQuery(query);
    if (id) {
      const avaliableCarIndex = avaliableCars.findIndex(
        (car: { id: number; name: string; LP: string }) => car.id === id,
      );
      return { carId: id, avaliable: avaliableCarIndex > -1 };
    }
    return avaliableCars;
  }
}
