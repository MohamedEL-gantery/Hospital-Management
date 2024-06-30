import 'reflect-metadata';
import path from 'path';

import { AppDataSource } from './db';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import AppError from './utils/appError';
import globalErrorHandler from './middlewares/error.middleware';

import mountRoutes from './index';

dotenv.config();

const app = express();

app.use(cors());
app.options('*', cors());


// compress all responses
app.use(compression());

// Set security HTTP headers
app.use(helmet());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join('__dirname', '/src/upload')));



// Mount Routes
mountRoutes(app);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

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

 export default app;