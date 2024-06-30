import 'express-async-errors';
import { AppDataSource } from '../db';
import { Cart } from '../entity/cart';
import { Calender } from '../entity/doctorCalender';
import { User } from '../entity/user';
import AppError from '../utils/appError';

const userRepository = AppDataSource.getRepository(User);
const calenderRepository = AppDataSource.getRepository(Calender);
const cartRepository = AppDataSource.getRepository(Cart);

class CartService {
  create = async (calender: any, user: any) => {
    const calenderExist = await calenderRepository.findOne({
      where: { id: calender },
      relations: ['doctor'],
    });

    if (!calenderExist) {
      throw new AppError('Cannot find calender', 400);
    }

    const userExist = await userRepository.findOne({ where: { id: user } });

    if (!userExist) {
      throw new AppError('Cannot find user', 400);
    }

    const cartExist = await cartRepository.findOne({
      where: { calender: { id: calender }, user: { id: user } },
    });

    if (cartExist) {
      throw new AppError('Cart already exist', 400);
    }

    const newCart = cartRepository.create({
      calender: calender,
      user: user,
      doctor: calenderExist.doctor.id,
      cartPrice: calenderExist.price,
    });

    await newCart.save();

    return newCart;
  };

  getAll = async (user: any) => {
    const data = await cartRepository.find({
      where: { user: { id: user } },
      relations: ['calender.doctor'],
    });

    if (!data) {
      throw new AppError('No cart found', 404);
    }

    return data;
  };

  deleteOne = async (id: any, user: any) => {
    const data = await cartRepository.findOne({
      where: { id, user: { id: user } },
    });

    if (!data) {
      throw new AppError('No cart found', 404);
    }

    data.remove();
  };
}

const cartService = new CartService();

export default cartService;
