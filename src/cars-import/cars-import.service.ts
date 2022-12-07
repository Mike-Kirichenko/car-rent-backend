import { QueryBuilder } from '@classes/queryBuilder';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsImportService {
  constructor(private queryBuilder: QueryBuilder) {}
  public async writeCarsToDbByChunks(data: string[]) {
    const [name, LP] = data;
    const query = `INSERT INTO car ("name", "LP") VALUES ('${name}', '${LP}')`;
    await this.queryBuilder.runQuery(query);
  }
}
