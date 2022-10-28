import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class QueryBuilder {
  conn: any;
  constructor(private configService: ConfigService) {
    this.conn = new Pool({
      user: this.configService.get('DB_USER'),
      host: this.configService.get('DB_HOST'),
      database: this.configService.get('DB_NAME'),
      password: this.configService.get('DB_PASSWORD'),
      port: this.configService.get('DB_PORT'),
    });
  }

  async runQuery(query: string) {
    try {
      const res = await this.conn.query(query);
      return res.rows;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
