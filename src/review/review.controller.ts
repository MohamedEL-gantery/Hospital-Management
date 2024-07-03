import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import reviewService, { ReviewService } from './review.service';
import CustomRequest from './../interfaces/customRequest';

class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  public createReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;
      if (!req.body.doctor) req.body.doctor = req.params.id;

      const { user, doctor, review, rating } = req.body;

      const newReview = await this.reviewService.create(
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

  public getAllReviews = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await this.reviewService.getAll();
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  public getAllReviewsOneDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await this.reviewService.getAllReviewOneDoctor(
        req.params.id
      );
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  public getAllReviewsOneUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const reviews = await this.reviewService.getAllReviewOneUser(
        req.params.id
      );
      res.status(200).json({
        status: 'success',
        result: reviews.length,
        date: reviews,
      });
    }
  );

  public getOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const review = await this.reviewService.getOne(req.params.id);
      res.status(200).json({
        status: 'success',
        date: review,
      });
    }
  );

  public updateOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { review, rating } = req.body;
      const updateReview = await this.reviewService.updateOne(
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

  public deleteOneReview = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.reviewService.deleteOne(
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

const reviewController = new ReviewController(reviewService);
export default reviewController;
