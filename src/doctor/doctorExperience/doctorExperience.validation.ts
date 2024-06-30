import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../../utils/appError';

const addExperienceSchema = joi.object({
  doctor: joi.string().optional(),
  hospitalName: joi.string().trim().required(),
  from: joi.date().required(),
  to: joi.date().required(),
  designation: joi.string().trim().required(),
});

const updateExperienceSchema = joi.object({
  hospitalName: joi.string().trim().optional(),
  from: joi.date().optional(),
  to: joi.date().optional(),
  designation: joi.string().trim().optional(),
});

export const experienceValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = addExperienceSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateExperienceValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateExperienceSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
