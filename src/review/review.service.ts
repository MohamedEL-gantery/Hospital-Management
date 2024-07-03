import 'express-async-errors';
import { AppDataSource } from '../db';
import { Doctor } from '../entities/doctor';
import { User } from '../entities/user';
import { Review } from '../entities/review';
import AppError from '../utils/appError';
import { Roles } from '../enum/roles';
import { DataSource } from 'typeorm';

export class ReviewService {
  private reviewRepository;
  private doctorRepository;
  private userRepository;

  constructor(private dataSource: DataSource) {
    this.reviewRepository = this.dataSource.getRepository(Review);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
    this.userRepository = this.dataSource.getRepository(User);
  }

  public create = async (
    doctor: any,
    user: any,
    review: string,
    rating: number
  ) => {
    const newReview = this.reviewRepository.create({
      doctor: { id: doctor },
      user: { id: user },
      review,
      rating,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('Doctor not found', 404);
    }

    const userId = await this.userRepository.findOne({ where: { id: user } });

    if (!userId) {
      throw new AppError('User not found', 404);
    }

    await newReview.save();

    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await this.doctorRepository.update(doctor, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await this.doctorRepository.update(doctor, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }

    return newReview;
  };

  public getAll = async () => {
    const data = await this.reviewRepository.find({
      relations: ['doctor', 'user'],
    });
    return data;
  };

  public getAllReviewOneDoctor = async (doctor: any) => {
    const data = await this.reviewRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor', 'user'],
    });
    return data;
  };

  public getAllReviewOneUser = async (user: any) => {
    const data = await this.reviewRepository.find({
      where: { user: { id: user } },
      relations: ['doctor', 'user'],
    });
    return data;
  };

  public getOne = async (id: any) => {
    const data = await this.reviewRepository.findOne({
      where: { id },
      relations: ['doctor', 'user'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  public updateOne = async (
    id: any,
    user: any,
    review?: string,
    rating?: number
  ) => {
    const data = await this.reviewRepository.findOne({
      where: { id, user: { id: user } },
      relations: ['doctor', 'user'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.rating = rating || data.rating;
    data.review = review || data.review;

    await data.save();

    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor: data.doctor.id })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await this.doctorRepository.update(data.doctor.id, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await this.doctorRepository.update(data.doctor.id, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }

    return data;
  };

  public deleteOne = async (id: any, user: any) => {
    const data = await this.reviewRepository.findOne({
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

    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.doctor', 'doctor')
      .addSelect('COUNT(review.id)', 'nRating')
      .addSelect('AVG(review.rating)', 'avgRating')
      .where('review.doctor = :doctor', { doctor: data.doctor.id })
      .groupBy('review.doctor')
      .getRawOne();

    if (stats) {
      await this.doctorRepository.update(data.doctor.id, {
        ratingsQuantity: stats.nRating,
        ratingsAverage: parseFloat(stats.avgRating),
      });
    } else {
      await this.doctorRepository.update(data.doctor.id, {
        ratingsQuantity: 0,
        ratingsAverage: 0,
      });
    }
  };
}

const reviewService = new ReviewService(AppDataSource);
export default reviewService;
