import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../db';
import { User } from '../entity/user';
import { Doctor } from '../entity/doctor';
import authService from './auth.service';
import { sendToken, signToken } from '../utils/signToken';
import AppError from '../utils/appError';
import CustomRequest from './../interfaces/customRequest';

const userRepository = AppDataSource.getRepository(User);
const doctorRepository = AppDataSource.getRepository(Doctor);

class AuthController {
  signUpUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;

      await authService.userSignup(name, email, password);

      res.status(201).json({
        status: 'success',
        message: 'user created successfully',
      });
    }
  );

  signUpDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password, phoneNumber } = req.body;

      await authService.doctorSignup(name, email, password, phoneNumber);

      res.status(201).json({
        status: 'success',
        message: 'doctor created successfully',
      });
    }
  );

  loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, email, phoneNumber } = req.body;

      if (!password) {
        return next(new AppError('Please enter your password', 400));
      }

      if (!email && !phoneNumber) {
        return next(
          new AppError('Please enter your email or phoneNumber', 400)
        );
      }

      const user = await authService.userLogin(password, email, phoneNumber);
      sendToken(user, 200, req, res);
    }
  );

  loginDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, email, phoneNumber } = req.body;

      if (!password) {
        return next(new AppError('Please enter your password', 400));
      }

      if (!email && !phoneNumber) {
        return next(
          new AppError('Please enter your email or phoneNumber', 400)
        );
      }

      const doctor = await authService.doctorLogin(
        password,
        email,
        phoneNumber
      );
      sendToken(doctor, 200, req, res);
    }
  );

  loginAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, email } = req.body;
      if (!email || !password) {
        return next(new AppError('Please enter your email or password', 400));
      }

      const admin = await authService.adminLogin(email, password);

      sendToken(admin, 200, req, res);
    }
  );

  forgetPasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const user = await authService.forgetUserPassword(email);

      const token = signToken({ id: user.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'please check your email for reset code ',
      });
    }
  );

  verifyResetCodeUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { resetCode } = req.body;

      const userCount = await userRepository.findOne({
        where: { id: (req as CustomRequest).user.id },
      });

      if (userCount) {
        userCount.countPassword += 1;

        await userCount.save();

        if (userCount.countPassword > 5) {
          return next(
            new AppError(
              'You have reached the maximum number of attempts, please try again later',
              400
            )
          );
        }
      }

      const user = await authService.verifyUserResetCode(resetCode);

      const token = signToken({ id: user.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'ResetCode verify successfully',
      });
    }
  );

  resetPasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await userRepository.findOne({
        where: { id: (req as CustomRequest).user.id },
      });

      if (!user) {
        return next(new AppError(`There is no user found`, 404));
      }

      const { password } = req.body;

      await authService.resetUserPassword(user.id, password);

      res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
      });
    }
  );

  forgetPasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const doctor = await authService.forgetDoctorPassword(email);

      const token = signToken({ id: doctor.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'please check your email for reset code ',
      });
    }
  );

  verifyResetCodeDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { resetCode } = req.body;

      const doctorCount = await doctorRepository.findOne({
        where: { id: (req as CustomRequest).doctor.id },
      });

      if (doctorCount) {
        doctorCount.countPassword += 1;

        await doctorCount.save();

        if (doctorCount.countPassword > 5) {
          return next(
            new AppError(
              'You have reached the maximum number of attempts, please try again later',
              400
            )
          );
        }
      }

      const doctor = await authService.verifyDoctorResetCode(resetCode);

      const token = signToken({ id: doctor.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'ResetCode verify successfully',
      });
    }
  );

  resetPasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await doctorRepository.findOne({
        where: { id: (req as CustomRequest).doctor.id },
      });

      if (!doctor) {
        return next(new AppError(`There is no doctor found`, 404));
      }

      const { password } = req.body;

      await authService.resetDoctorPassword(doctor.id, password);

      res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
      });
    }
  );

  updatePasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await userRepository.findOne({
        where: { id: (req as CustomRequest).user.id },
      });

      if (!user) {
        return next(new AppError(`There is no user found`, 404));
      }

      const { passwordCurrent, password } = req.body;

      const userUpdate = await authService.updateUserPassword(
        user.id,
        passwordCurrent,
        password
      );

      sendToken(userUpdate, 200, req, res);
    }
  );

  updatePasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await doctorRepository.findOne({
        where: { id: (req as CustomRequest).doctor.id },
      });

      if (!doctor) {
        return next(new AppError(`There is no doctor found`, 404));
      }

      const { passwordCurrent, password } = req.body;

      const doctorUpdate = await authService.updateDoctorPassword(
        doctor.id,
        passwordCurrent,
        password
      );

      sendToken(doctorUpdate, 200, req, res);
    }
  );
}

const authController = new AuthController();
export default authController;
