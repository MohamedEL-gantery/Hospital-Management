import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';
import CustomRequest from './../interfaces/customRequest';
export const restrictTo = (...roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as CustomRequest).role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
