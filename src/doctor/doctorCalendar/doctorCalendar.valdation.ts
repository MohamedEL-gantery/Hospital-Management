import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';

const calendarSchema = joi.object({
  doctor: joi.string().optional(),
  day: joi.string().required(),
  date: joi.date().required(),
  dateOfStart: joi.string().required(),
  dateOfEnd: joi.string().required(),
  duration: joi.string().required(),
  price: joi.number().required(),
});

const updateCalendarSchema = joi.object({
  day: joi.string().optional(),
  date: joi.date().optional(),
  dateOfStart: joi.string().optional(),
  dateOfEnd: joi.string().optional(),
  duration: joi.string().optional(),
  price: joi.number().optional(),
});

export const calendarValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = calendarSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateCalendarValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateCalendarSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
