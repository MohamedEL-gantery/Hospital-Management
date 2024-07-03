import 'express-async-errors';
import { AppDataSource } from '../db';
import { Cart } from '../entities/cart';
import { Calender } from '../entities/doctorCalender';
import { User } from '../entities/user';
import AppError from '../utils/appError';
import { DataSource } from 'typeorm';

export class CartService {
  private userRepository;
  private calenderRepository;
  private cartRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.calenderRepository = this.dataSource.getRepository(Calender);
    this.cartRepository = this.dataSource.getRepository(Cart);
  }

  public create = async (calender: any, user: any) => {
    const calenderExist = await this.calenderRepository.findOne({
      where: { id: calender },
      relations: ['doctor'],
    });

    if (!calenderExist) {
      throw new AppError('Cannot find calender', 400);
    }

    const userExist = await this.userRepository.findOne({
      where: { id: user },
    });

    if (!userExist) {
      throw new AppError('Cannot find user', 400);
    }

    const cartExist = await this.cartRepository.findOne({
      where: { calender: { id: calender }, user: { id: user } },
    });

    if (cartExist) {
      throw new AppError('Cart already exist', 400);
    }

    const newCart = this.cartRepository.create({
      calender: calender,
      user: user,
      doctor: calenderExist.doctor.id,
      cartPrice: calenderExist.price,
    });

    await newCart.save();

    return newCart;
  };

  public getAll = async (user: any) => {
    const data = await this.cartRepository.find({
      where: { user: { id: user } },
      relations: ['calender.doctor'],
    });

    if (!data) {
      throw new AppError('No cart found', 404);
    }

    return data;
  };

  public deleteOne = async (id: any, user: any) => {
    const data = await this.cartRepository.findOne({
      where: { id, user: { id: user } },
    });

    if (!data) {
      throw new AppError('No cart found', 404);
    }

    data.remove();
  };
}

const cartService = new CartService(AppDataSource);

export default cartService;
