import express from 'express';
import userWishListController from './userWishList.controller';
import { restrictTo } from '../../middlewares/restrictTo.middleware';
import { protect } from '../../middlewares/protect.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect, restrictTo(Roles.user));

router
  .route('/')
  .post(userWishListController.createWishList)
  .get(userWishListController.getAllWishList);

router.route('/all').get(userWishListController.getAllWishList);

router.route('/:id').delete(userWishListController.deleteOneWishlist);

export default router;
