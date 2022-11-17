import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class QueryBuilder implements OnModuleInit {
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

  async onModuleInit(): Promise<void> {
    const carQuery = `CREATE TABLE IF NOT EXISTS "car" (
      id SERIAL PRIMARY KEY,
      name VARCHAR (50) NOT NULL,
      "LP" VARCHAR (10) UNIQUE NOT NULL
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
    } catch ({ message: msg }) {
      console.log({ msg });
    }
  }

  async runQuery(query: string) {
    try {
      const res = await this.conn.query(query);
      return res.command === 'SELECT' ? res.rows : res.rowCount;
    } catch ({ message: msg }) {
      throw new BadRequestException({ msg });
    }
  }
}
