import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const signToken = (payload: { id: number | string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

export const sendToken = (
  data: any,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken({ id: data.id });

  data.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data,
  });
};
