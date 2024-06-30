import 'express-async-errors';
import { AppDataSource } from '../db';
import { Doctor } from '../entity/doctor';
import { User } from '../entity/user';
import { Review } from '../entity/review';
import AppError from '../utils/appError';
import { Roles } from '../enum/roles';

const reviewRepository = AppDataSource.getRepository(Review);
const doctorRepository = AppDataSource.getRepository(Doctor);
const userRepository = AppDataSource.getRepository(User);

class ReviewService {
  create = async (doctor: any, user: any, review: string, rating: number) => {
    const newReview = reviewRepository.create({
      doctor: { id: doctor },
      user: { id: user },
      review,
      rating,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('Doctor not found', 404);
    }

    const userId = await userRepository.findOne({ where: { id: user } });

    if (!userId) {
      throw new AppError('User not found', 404);
    }

    await newReview.save();

    const stats = await reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await doctorRepository.update(doctor, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await doctorRepository.update(doctor, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }

    return newReview;
  };

  getAll = async () => {
    const data = await reviewRepository.find({
      relations: ['doctor', 'user'],
    });
    return data;
  };

  getAllReviewOneDoctor = async (doctor: any) => {
    const data = await reviewRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor', 'user'],
    });
    return data;
  };

  getAllReviewOneUser = async (user: any) => {
    const data = await reviewRepository.find({
      where: { user: { id: user } },
      relations: ['doctor', 'user'],
    });
    return data;
  };

  getOne = async (id: any) => {
    const data = await reviewRepository.findOne({
      where: { id },
      relations: ['doctor', 'user'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  updateOne = async (id: any, user: any, review?: string, rating?: number) => {
    const data = await reviewRepository.findOne({
      where: { id, user: { id: user } },
      relations: ['doctor', 'user'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.rating = rating || data.rating;
    data.review = review || data.review;

    await data.save();

    const stats = await reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor: data.doctor.id })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await doctorRepository.update(data.doctor.id, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await doctorRepository.update(data.doctor.id, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }

    return data;
  };

  deleteOne = async (id: any, user: any) => {
    const data = await reviewRepository.findOne({
      where: { id },
      relations: ['doctor', 'user'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    if (data.user.id !== user && data.user.role !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }
    await data.remove();

    const stats = await reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor: data.doctor.id })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await doctorRepository.update(data.doctor.id, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await doctorRepository.update(data.doctor.id, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }
  };
}

const reviewService = new ReviewService();
export default reviewService;
