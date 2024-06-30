import { User } from '../entity/user';
import { Doctor } from '../entity/doctor';
import { Request } from 'express';

export default interface CustomRequest extends Request {
  user?: any | User;
  doctor?: any | Doctor;
  role: string;
}
