import 'express-async-errors';
import { AppDataSource } from '../../db';
import { DataSource } from 'typeorm';
import { UserWishlist } from '../../entities/userWishlist';
import { User } from '../../entities/user';
import { Doctor } from '../../entities/doctor';
import AppError from '../../utils/appError';

export class UserWishlistService {
  private userRepository;
  private doctorRepository;
  private userWishlistRepository;
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
    this.userWishlistRepository = this.dataSource.getRepository(UserWishlist);
  }

  public create = async (user: any, doctor: any) => {
    const userId = await this.userRepository.findOne({ where: { id: user } });

    if (!userId) {
      throw new AppError('User not found', 400);
    }

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('Doctor not found', 400);
    }

    const foundWishList = await this.userWishlistRepository.findOne({
      where: { user: { id: user }, doctor: { id: doctor } },
    });

    if (foundWishList) {
      throw new AppError('Doctor already exist in your wishlist', 400);
    }

    const newWishlist = this.userWishlistRepository.create({
      user,
      doctor,
    });

    await newWishlist.save();

    return newWishlist;
  };

  public getAll = async (user: any) => {
    const data = await this.userWishlistRepository.find({
      where: { user: { id: user } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('No wishlist found', 400);
    }

    return data;
  };

  public deleteOne = async (id: any, user: any) => {
    const data = await this.userWishlistRepository.findOne({
      where: { id, user: { id: user } },
    });

    if (!data) {
      throw new AppError('No wishlist found', 400);
    }

    await data.remove();
  };
}

const userWishlistService = new UserWishlistService(AppDataSource);
export default userWishlistService;
