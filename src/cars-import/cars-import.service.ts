import { QueryBuilder } from '@classes/queryBuilder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsImportService {
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
}
