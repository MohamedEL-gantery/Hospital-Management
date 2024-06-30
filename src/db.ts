import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  // host: process.env.HOST,
  // port: parseInt(process.env.DB_PORT || '5432'),
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB,
  host: 'localhost',
  port: 5432,
  database: 'hospital',
  username: 'postgres',
  password: '123789',
  synchronize: false,
  logging: false,
  entities: ['src/entity/**/*.ts' ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
