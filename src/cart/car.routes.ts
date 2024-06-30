import express from 'express';
import cartController from './cart.controller';
import { protect } from '../middlewares/protect.middleware';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { Roles } from '../enum/roles';

const router = express.Router();

router.use(protect, restrictTo(Roles.user));

router
  .route('/')
  .post(cartController.createCart)
  .get(cartController.getAllCart);

router.route('/:id').delete(cartController.deleteOneCart);

export default router;
