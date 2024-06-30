import 'express-async-errors';
import { AppDataSource } from '../db';
import { User } from '../entity/user';
import AppError from '../utils/appError';
import { Blood } from '../enum/blood';
import { Gender } from '../enum/gender';
import { Like } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);

class UserService {
  getAll = async () => {
    const users = await userRepository.find({
      relations: [
        'userDependent.user',
        'userReview.doctor',
        'wishlist.doctor',
        'userCart.calender.doctor',
      ],
    });
    return users;
  };

  getOne = async (id: any) => {
    const user = await userRepository.findOne({
      where: { id },
      relations: [
        'userDependent.user',
        'userReview.doctor',
        'wishlist.doctor',
        'userCart.calender.doctor',
      ],
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  };

  updateOne = async (
    id: any,
    name?: string,
    email?: string,
    phoneNumber?: string,
    ssn?: number,
    photo?: string,
    country?: string,
    city?: string,
    address?: string,
    birthDate?: Date,
    age?: number,
    blood?: Blood,
    gender?: Gender
  ) => {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.email = email || user.email;
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.ssn = ssn || user.ssn;
    user.photo = photo || user.photo;
    user.country = country || user.country;
    user.city = city || user.city;
    user.address = address || user.address;
    user.birthDate = birthDate || user.birthDate;
    user.age = age || user.age;
    user.blood = blood || user.blood;
    user.gender = gender || user.gender;

    await user.save();

    return user;
  };

  deleteOne = async (id: any) => {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.remove();
  };

  search = async (name: string) => {
    const user = await userRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  };
}

const userService = new UserService();

export default userService;
