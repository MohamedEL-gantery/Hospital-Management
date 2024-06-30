import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const namePattern = /^[a-zA-Z]+$/;

const emailPattern =
  /^(?:[a-zA-Z0-9._%+-]+)@(?!.*\d)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const phonePattern = /^(010|011|012|015)\d{8}$/;

const updateUserSchema = joi.object({
  name: joi.string().pattern(namePattern).optional(),
  email: joi.string().email().pattern(emailPattern).optional(),
  phoneNumber: joi.string().min(11).max(11).pattern(phonePattern).optional(),
  ssn: joi.number().optional(),
  photo: joi.string().optional(),
  country: joi.string().optional(),
  city: joi.string().optional(),
  address: joi.string().optional(),
  birthDate: joi.date().optional(),
  age: joi.number().optional(),
  blood: joi.string().optional(),
  gender: joi.string().optional(),
});

const searchSchema = joi.object({
  name: joi.string().pattern(namePattern).required(),
});

export const userValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateUserSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const searchValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = searchSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
