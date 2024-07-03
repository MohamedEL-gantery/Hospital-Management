import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { Cart } from '../entities/cart';
import { User } from '../entities/user';
import { Doctor } from '../entities/doctor';
import { Calender } from '../entities/doctorCalender';
import { Booking } from '../entities/booking';
import AppError from '../utils/appError';
import CustomRequest from './../interfaces/customRequest';

const secret: any = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secret, {
  apiVersion: '2024-06-20',
});

class BookingController {
  private userRepository;
  private doctorRepository;
  private calenderRepository;
  private cartRepository;
  private bookingRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
    this.calenderRepository = this.dataSource.getRepository(Calender);
    this.cartRepository = this.dataSource.getRepository(Cart);
    this.bookingRepository = this.dataSource.getRepository(Booking);
  }

  public checkoutSession = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await this.cartRepository.findOne({
        where: { id: req.params.id },
        relations: ['calender', 'user'],
      });

      if (!cart) {
        return next(new AppError('Could not find cart', 404));
      }

      const calender = await this.calenderRepository.findOne({
        where: { id: cart.calender.id },
        relations: ['doctor'],
      });

      if (!calender) {
        return next(new AppError('Could not find doctor calender', 404));
      }

      if (calender.paid === true) {
        return next(new AppError(`Doctor's calender is already paid`, 400));
      }

      const totalPrice = 30 + cart.cartPrice;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'egp',
              unit_amount: totalPrice * 100,
              product_data: {
                name: `Doctor ${calender.doctor.name}`,
                description: `Phone ${calender.doctor.phoneNumber}`,
                images: [calender.doctor.photo],
              },
            },
          },
        ],
        mode: 'payment',
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/cart`,
        customer_email: (req as CustomRequest).user.email,
        client_reference_id: req.params.id,
        metadata: {
          doctorId: calender.doctor.id,
          email: calender.doctor.email,
          clinicAddress: calender.doctor.clinicAddress,
        },
      });

      res.status(200).json({
        status: 'success',
        session,
      });
    }
  );
}

const bookingController = new BookingController(AppDataSource);
export default bookingController;
