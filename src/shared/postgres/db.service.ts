import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as postgres from 'postgres';

@Injectable()
export class DbService {
    private PG_HOST = this.configService.get<string>('PGHOST');
    private PG_DATABASE = this.configService.get<string>('PGDATABASE');
    private PG_USER = this.configService.get<string>('PGUSER');
    private PG_PASSWORD = this.configService.get<string>('PGPASSWORD');
    private ENDPOINT_ID = this.configService.get<string>('ENDPOINT_ID');
    private readonly URL = `postgres://username:password@host/database?options=project%3D${this.ENDPOINT_ID}`;
    readonly sql = postgres(this.URL, {
        username: this.PG_USER,
        password: this.PG_PASSWORD,
        host: this.PG_HOST,
        database: this.PG_DATABASE,
        ssl: 'require',
    });

    constructor(private configService: ConfigService) {}
}
