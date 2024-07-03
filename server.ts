import 'reflect-metadata';
import { AppDataSource } from './src/db';
import app from './src/app'

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`APP Running On Port : ${PORT} `);
    });

    console.log('DB Connected Successfully');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });