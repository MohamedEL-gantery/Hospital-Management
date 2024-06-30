import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';

const addEducationSchema = joi.object({
  doctor: joi.string().optional(),
  degree: joi.string().trim().required(),
  yearOfCompletion: joi.date().required(),
  college: joi.string().trim().required(),
});

const updateEducationSchema = joi.object({
  degree: joi.string().trim().optional(),
  yearOfCompletion: joi.date().optional(),
  college: joi.string().trim().optional(),
});

export const educationValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = addEducationSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateEducationValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateEducationSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
