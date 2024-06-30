import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AppDataSource } from '../db';
import { Cart } from '../entity/cart';
import { User } from '../entity/user';
import { Doctor } from '../entity/doctor';
import { Calender } from '../entity/doctorCalender';
import { Booking } from '../entity/booking';
import AppError from '../utils/appError';
import CustomRequest from './../interfaces/customRequest';


const secret: any = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secret, {
  apiVersion: '2024-06-20',
});

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);
const calenderRepository = AppDataSource.getRepository(Calender);
const cartRepository = AppDataSource.getRepository(Cart);
const bookingRepository = AppDataSource.getRepository(Booking);

class BookingController {
  checkoutSession = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartRepository.findOne({
        where: { id: req.params.id },
        relations: ['calender', 'user'],
      });

      if (!cart) {
        return next(new AppError('Could not find cart', 404));
      }


const calender=await calenderRepository.findOne({where:{id:cart.calender.id},relations:['doctor']});

      if(!calender){
        return next(new AppError('Could not find doctor calender', 404));
      }


if(calender.paid === true){
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
                description:`Phone ${calender.doctor.phoneNumber}`,
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
          //yearsOfExperience: calender.doctor.,
        },
      });

      res.status(200).json({
        status: 'success',
        session,
      });
    }
  );
}

const bookingController = new BookingController();
export default bookingController;
