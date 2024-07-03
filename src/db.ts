import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Blog } from './entities/blog';
import { Booking } from './entities/booking';
import { Cart } from './entities/cart';
import { Category } from './entities/category';
import { ContactUs } from './entities/contactus';
import { Doctor } from './entities/doctor';
import { DoctorAwards } from './entities/doctorAwards';
import { DoctorClinicPhoto } from './entities/doctorClinicPhoto';
import { DoctorEducation } from './entities/doctorEducation';
import { DoctorExperience } from './entities/doctorExperience';
import { Calender } from './entities/doctorCalender';
import { User } from './entities/user';
import { UserDependent } from './entities/userDependent';
import { UserWishlist } from './entities/userWishlist';
import { Review } from './entities/review';
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
});
