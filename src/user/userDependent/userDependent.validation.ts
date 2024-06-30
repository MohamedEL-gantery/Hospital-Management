import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';

const addDependentScheme = joi.object({
  relationship: joi.string().required(),
  userId: joi.string().required(),
});

const updateDependentScheme = joi.object({
  relationship: joi.string(),
});

export const addDependentValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDependentScheme.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateDependentValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateDependentScheme.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
