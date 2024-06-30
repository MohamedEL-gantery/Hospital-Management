import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const namePattern = /^[a-zA-Z]+$/;

const categorySchema = joi.object({
  name: joi.string().pattern(namePattern).required(),
});

const categoryUpdateSchema = joi.object({
  name: joi.string().pattern(namePattern).optional(),
});

export const categoryValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = categorySchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const categoryUpdateValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = categoryUpdateSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
