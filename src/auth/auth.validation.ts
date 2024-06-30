import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const namePattern = /^[a-zA-Z]+$/;

const emailPattern =
  /^(?:[a-zA-Z0-9._%+-]+)@(?!.*\d)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const phonePattern = /^(010|011|012|015)\d{8}$/;

const numberPattern = /^\d+$/;

const createUserSchema = joi.object({
  name: joi.string().pattern(namePattern).required(),
  email: joi.string().email().pattern(emailPattern).required(),
  password: joi.string().pattern(passwordPattern).required(),
});

const createDoctorSchema = joi.object({
  name: joi.string().pattern(namePattern).required(),
  email: joi.string().email().pattern(emailPattern).required(),
  password: joi.string().pattern(passwordPattern).required(),
  phoneNumber: joi.string().min(11).max(11).pattern(phonePattern).required(),
});

const LoginSchema = joi.object({
  password: joi.string().pattern(passwordPattern).required(),
  email: joi.string().email().pattern(emailPattern).optional(),
  phoneNumber: joi.string().min(11).max(11).pattern(phonePattern).optional(),
});

const LoginAdminSchema = joi.object({
  password: joi.string().pattern(passwordPattern).required(),
  email: joi.string().email().pattern(emailPattern).required(),
});

const forgetPasswordSchema = joi.object({
  email: joi.string().email().pattern(emailPattern).required(),
});

const verifyCodeSchema = joi.object({
  resetCode: joi.string().pattern(numberPattern).required(),
});

const resetPasswordSchema = joi.object({
  password: joi.string().pattern(passwordPattern).required(),
});

const updatePasswordSchema = joi.object({
  passwordCurrent: joi.string().pattern(passwordPattern).required(),
  password: joi.string().pattern(passwordPattern).required(),
});

export const userValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = createUserSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const doctorValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = createDoctorSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const loginValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = LoginSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const loginAdminValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = LoginAdminSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const forgetPasswordValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = forgetPasswordSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const verifyCodeValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = verifyCodeSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const resetPasswordValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = resetPasswordSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updatePasswordValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updatePasswordSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
