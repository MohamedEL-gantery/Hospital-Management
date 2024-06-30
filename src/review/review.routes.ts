import express from 'express';
import reviewController from './review.controller';
import { reviewValidation, updateReviewValidation } from './review.validation';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { protect } from '../middlewares/protect.middleware';
import { Roles } from '../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/add/:id')
  .post(
    restrictTo(Roles.user),
    reviewValidation,
    reviewController.createReview
  );

router
  .route('/')
  .post(restrictTo(Roles.user), reviewValidation, reviewController.createReview)
  .get(reviewController.getAllReviews);

router.route('/user/:id').get(reviewController.getAllReviewsOneUser);

router.route('/doctor/:id').get(reviewController.getAllReviewsOneDoctor);

router
  .route('/:id')
  .get(reviewController.getOneReview)
  .patch(
    restrictTo(Roles.user),
    updateReviewValidation,
    reviewController.updateOneReview
  )
  .delete(
    restrictTo(Roles.user, Roles.admin),
    reviewController.deleteOneReview
  );

export default router;
