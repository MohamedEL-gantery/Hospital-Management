import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const entitiesPath = isProduction ? 'dist/entity/**/*.js' : 'src/entity/**/*.ts';
const migrationsPath = isProduction ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST ,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB ,
  synchronize: false,
  logging: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
});
