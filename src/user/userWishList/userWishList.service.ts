import 'express-async-errors';
import { AppDataSource } from '../../db';
import { UserWishlist } from '../../entity/userWishlist';
import { User } from '../../entity/user';
import { Doctor } from '../../entity/doctor';
import AppError from '../../utils/appError';

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);
const userWishlistRepository = AppDataSource.getRepository(UserWishlist);

class UserWishlistService {
  crete = async (user: any, doctor: any) => {
    const userId = await userRepository.findOne({ where: { id: user } });

    if (!userId) {
      throw new AppError('User not found', 400);
    }

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('Doctor not found', 400);
    }

    const foundWishList = await userWishlistRepository.findOne({
      where: { user: { id: user }, doctor: { id: doctor } },
    });

    if (foundWishList) {
      throw new AppError('Doctor already exist in your wishlist', 400);
    }

    const newWishlist = userWishlistRepository.create({
      user,
      doctor,
    });

    await newWishlist.save();

    return newWishlist;
  };

  getAll = async (user: any) => {
    const data = await userWishlistRepository.find({
      where: { user: { id: user } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('No wishlist found', 400);
    }

    return data;
  };

  deleteOne = async (id: any, user: any) => {
    const data = await userWishlistRepository.findOne({
      where: { id, user: { id: user } },
    });

    if (!data) {
      throw new AppError('No wishlist found', 400);
    }

    await data.remove();
  };
}

const userWishlistService = new UserWishlistService();
export default userWishlistService;
