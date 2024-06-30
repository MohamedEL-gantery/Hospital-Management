import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';

const addAwardsSchema = joi.object({
  doctor: joi.string().optional(),
  awards: joi.string().trim().required(),
  year: joi.date().required(),
});

const updateAwardsSchema = joi.object({
  awards: joi.string().trim().optional(),
  year: joi.date().optional(),
});

export const awardsValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = addAwardsSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateAwardsValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateAwardsSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
