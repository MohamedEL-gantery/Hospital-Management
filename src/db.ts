import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Blog } from './entity/blog';
import { Booking } from './entity/booking';
import { Cart } from './entity/cart';
import { Category } from './entity/category';
import { ContactUs } from './entity/contactus';
import { Doctor } from './entity/doctor';
import { DoctorAwards } from './entity/doctorAwards';
import { DoctorClinicPhoto } from './entity/doctorClinicPhoto';
import { DoctorEducation } from './entity/doctorEducation';
import { DoctorExperience } from './entity/doctorExperience';
import { Calender } from './entity/doctorCalender';
import { User } from './entity/user';
import { UserDependent } from './entity/userDependent';
import { UserWishlist } from './entity/userWishlist';
import { Review } from './entity/review';
import { Hospital1719766323186 } from './migrations/1719766323186-hospital';

import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  synchronize: false,
  logging: false,
  entities: [
    Blog,
    Booking,
    ContactUs,
    Cart,
    Category,
    Doctor,
    DoctorAwards,
    DoctorClinicPhoto,
    DoctorEducation,
    DoctorExperience,
    Calender,
    User,
    UserDependent,
    UserWishlist,
    Review,
  ],
  migrations: [Hospital1719766323186],
  subscribers: [],
});
