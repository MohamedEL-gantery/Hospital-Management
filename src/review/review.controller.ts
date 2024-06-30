import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import reviewService from './review.service';
import CustomRequest from './../interfaces/customRequest';
import { config } from 'dotenv';

class ReviewController {
  createReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;
      if (!req.body.doctor) req.body.doctor = req.params.id;

      const { user, doctor, review, rating } = req.body;

      const newReview = await reviewService.create(
        doctor,
        user,
        review,
        rating
      );

      res.status(201).json({
        status: 'success',
        date: newReview,
      });
    }
  );

  getAllReviews = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await reviewService.getAll();
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  getAllReviewsOneDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await reviewService.getAllReviewOneDoctor(req.params.id);
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  getAllReviewsOneUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await reviewService.getAllReviewOneUser(req.params.id);
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  getOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const review = await reviewService.getOne(req.params.id);
      res.status(200).json({
        status: 'success',
        date: review,
      });
    }
  );

  updateOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { review, rating } = req.body;
      const updateReview = await reviewService.updateOne(
        req.params.id,
        (req as CustomRequest).user.id,
        review,
        rating
      );

      res.status(200).json({
        status: 'success',
        date: updateReview,
      });
    }
  );

  deleteOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await reviewService.deleteOne(
        req.params.id,
        (req as CustomRequest).user.id
      );

      res.status(204).json({
        status: 'success',
        date: null,
      });
    }
  );
}

const reviewController = new ReviewController();
export default reviewController;
