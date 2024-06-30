import asyncHandler from 'express-async-handler';
import joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const BlogSchema = joi.object({
  text: joi.string().trim().required(),
  doctor: joi.string().optional(),
  category: joi.string().required(),
});

const updateBlogSchema = joi.object({
  text: joi.string().trim().optional(),
  category: joi.string().optional(),
});

export const blogValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = BlogSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);

export const updateBlogValidation = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateBlogSchema.validate(req.body);

    if (error) {
      return next(new AppError(error.message, 400));
    }

    next();
  }
);
