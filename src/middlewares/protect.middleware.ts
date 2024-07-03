import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../db';
import { User } from '../entities/user';
import { Doctor } from '../entities/doctor';
import AppError from '../utils/appError';
import CustomRequest from '../interfaces/customRequest';

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    let currentUser;

    currentUser = await userRepository.findOne({ where: { id: decoded.id } });

    if (!currentUser) {
      currentUser = await doctorRepository.findOne({
        where: { id: decoded.id },
      });

      if (!currentUser) {
        return next(
          new AppError(
            'The user belonging to this token does no longer exist',
            401
          )
        );
      }
    }

    if (currentUser.changedPasswordAt(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    (req as CustomRequest).user = currentUser;
    (req as CustomRequest).doctor = currentUser;
    (req as CustomRequest).role = currentUser.role;

    next();
  }
);
