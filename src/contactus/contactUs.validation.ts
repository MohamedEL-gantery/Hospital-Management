import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const contactUsSchema = joi.object({
  name: joi
    .string()
    .pattern(/^[a-zA-Z]+$/)
    .required(),
  email: joi.string().email().required(),
  phone: joi.string().min(11).max(11).required(),
  message: joi.string().trim().required(),
});

export const contactUsValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = contactUsSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }
    next();
  }
);
