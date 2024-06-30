import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const addReviewSchema = joi.object({
  doctor: joi.string().optional(),
  user: joi.string().optional(),
  review: joi.string().trim().required(),
  rating: joi.number().integer().required(),
});

const updateReviewSchema = joi.object({
  review: joi.string().trim().optional(),
  rating: joi.number().integer().optional(),
});

export const reviewValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = addReviewSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateReviewValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateReviewSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
