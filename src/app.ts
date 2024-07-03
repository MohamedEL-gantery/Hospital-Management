import path from 'path';
import express, { Request, Response, NextFunction, Application } from 'express';

import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import AppError from './utils/appError';
import globalErrorHandler from './middlewares/error.middleware';
import mountRoutes from './index';



class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.options('*', cors());

    this.app.use(compression());
    this.app.use(helmet());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use(express.json({ limit: '10kb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    this.app.use(express.static(path.join('__dirname', '/src/upload')));
  }

  private initializeRoutes() {
    mountRoutes(this.app);
    this.app.all('*', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    });
  }

  private initializeErrorHandling() {
    this.app.use(globalErrorHandler);
  }

}

const application = new App();
export default application.app;


