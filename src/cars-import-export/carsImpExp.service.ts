import { createWriteStream } from 'fs';
import { QueryBuilder } from '@classes/queryBuilder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsImpExpService {
  constructor(private queryBuilder: QueryBuilder) {}

  public async writeCarsToDbByChunks(data: string[]) {
    const insertQuery = [];
    for (const carRow of data) {
      const [name, LP] = carRow;
      insertQuery.push(`('${name}', '${LP}')`);
    }
    insertQuery.join(',');
    const query = `INSERT INTO car ("name", "LP") VALUES ${insertQuery}`;
    await this.queryBuilder.runQuery(query);
  }

  public async exportCarsList() {
    const limit = 100;
    const writableStream = createWriteStream('uploads/cars.csv');
    const countQuery = `SELECT COUNT (*) FROM car`;
    const [{ count }] = await this.queryBuilder.runQuery(countQuery);
    for (let i = 0; i < count; i += limit) {
      const query = `SELECT * FROM car ORDER BY ID ASC OFFSET ${i} LIMIT ${limit} `;
      const rows = await this.queryBuilder.runQuery(query);
      for (const row of rows) {
        const { name, LP } = row;
        writableStream.write(`${name}, ${LP}`);
        writableStream.write(`\n`);
      }
    }
  }
}
