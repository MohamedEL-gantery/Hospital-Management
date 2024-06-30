import express from 'express';
import bookingController from './booking.controller';
import { protect } from '../middlewares/protect.middleware';
import { restrictTo } from '../middlewares/restrictTo.middleware';

const router = express.Router();

router.use(protect);

router.route('/checkout/:id').get(bookingController.checkoutSession);

export default router;
