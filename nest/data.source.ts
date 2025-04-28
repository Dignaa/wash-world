import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.DB_PORT || 5432;

export const dbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
       host: process.env.DB_HOST,
       port: +port,
       username: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       synchronize: false,
       entities: [__dirname + '/**/*.entity{.ts,.js}'],
       migrations: ['dist/src/migrations/*{.ts,.js}'],
}

const dataSource = new DataSource(dbConfig as DataSourceOptions);
export default dataSource;