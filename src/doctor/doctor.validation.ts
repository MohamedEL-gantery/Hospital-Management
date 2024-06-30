import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const namePattern = /^[a-zA-Z]+$/;

const emailPattern =
  /^(?:[a-zA-Z0-9._%+-]+)@(?!.*\d)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const phonePattern = /^(010|011|012|015)\d{8}$/;

const updateDoctorSchema = joi.object({
  name: joi.string().pattern(namePattern).optional(),
  email: joi.string().email().pattern(emailPattern).optional(),
  phoneNumber: joi.string().min(11).max(11).pattern(phonePattern).optional(),
  photo: joi.string().optional(),
  country: joi.string().optional(),
  city: joi.string().optional(),
  address: joi.string().optional(),
  birthDate: joi.date().optional(),
  aboutMe: joi.string().trim().optional(),
  gender: joi.string().optional(),
  price: joi.string().optional(),
  clinicName: joi.string().trim().optional(),
  clinicAddress: joi.string().trim().optional(),
  facebookUrl: joi.string().optional(),
  twitterUrl: joi.string().optional(),
  instagramUrl: joi.string().optional(),
  youtubeUrl: joi.string().optional(),
  linkedinUrl: joi.string().optional(),
  category: joi.string().optional(),
});

const searchSchema = joi.object({
  name: joi.string().pattern(namePattern).required(),
});

export const doctorValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateDoctorSchema.validate(req.body);

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
