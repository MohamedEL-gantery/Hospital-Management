import { User } from '../entities/user';
import { Doctor } from '../entities/doctor';
import { Request } from 'express';

export default interface CustomRequest extends Request {
  user?: any | User;
  doctor?: any | Doctor;
  role: string;
}
