import { Application } from 'express';
import authRouter from './auth/auth.routes';
import contactUsRouter from './contactus/contactUs.routes';
import userRouter from './user/user.routes';
import userDependentRouter from './user/userDependent/userDependent.routes';
import userWishlistRouter from './user/userWishList/userWishList.routes';
import categoryRouter from './category/category.routes';
import doctorRouter from './doctor/doctor.routes';
import doctorExperienceRouter from './doctor/doctorExperience/doctorExperience.routes';
import doctorEducationRouter from './doctor/doctorEducation/doctorEducation.routes';
import doctorAwardsRouter from './doctor/doctorAwards/doctorAwards.routes';
import doctorClinicPhotoRouter from './doctor/doctorClinicPhoto/doctorClinicPhoto.routes';
import doctorCalenderRouter from './doctor/doctorCalendar/doctorCalendar.routes';
import blogRouter from './blog/blog.routes';
import reviewRouter from './review/review.routes';
import cartRouter from './cart/car.routes';
import bookingRouter from './booking/booking.routes';

const mountRoutes = (app: Application) => {
  app.use('/api/v1/contactus', contactUsRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/users/dependents', userDependentRouter);
  app.use('/api/v1/users/wishlist', userWishlistRouter);
  app.use('/api/v1/categories', categoryRouter);
  app.use('/api/v1/doctors', doctorRouter);
  app.use('/api/v1/doctors/experiences', doctorExperienceRouter);
  app.use('/api/v1/doctors/educations', doctorEducationRouter);
  app.use('/api/v1/doctors/awards', doctorAwardsRouter);
  app.use('/api/v1/doctors/photos', doctorClinicPhotoRouter);
  app.use('/api/v1/doctors/calender', doctorCalenderRouter);
  app.use('/api/v1/blogs', blogRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('/api/v1/carts', cartRouter);
  app.use('/api/v1/bookings', bookingRouter);
};

export default mountRoutes;
