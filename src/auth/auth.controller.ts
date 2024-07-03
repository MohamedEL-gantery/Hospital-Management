import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { User } from '../entities/user';
import { Doctor } from '../entities/doctor';
import authService, { AuthService } from './auth.service';
import { sendToken, signToken } from '../utils/signToken';
import AppError from '../utils/appError';
import CustomRequest from './../interfaces/customRequest';

class AuthController {
  private userRepository;
  private doctorRepository;

  constructor(
    private dataSource: DataSource,
    private readonly authService: AuthService
  ) {
    this.userRepository = this.dataSource.getRepository(User);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public signUpUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;

      await this.authService.userSignup(name, email, password);

      res.status(201).json({
        status: 'success',
        message: 'user created successfully',
      });
    }
  );

  public signUpDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password, phoneNumber } = req.body;

      await this.authService.doctorSignup(name, email, password, phoneNumber);

      res.status(201).json({
        status: 'success',
        message: 'doctor created successfully',
      });
    }
  );

  public loginUser = asyncHandler(
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

      const user = await this.authService.userLogin(
        password,
        email,
        phoneNumber
      );
      sendToken(user, 200, req, res);
    }
  );

  public loginDoctor = asyncHandler(
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

      const doctor = await this.authService.doctorLogin(
        password,
        email,
        phoneNumber
      );
      sendToken(doctor, 200, req, res);
    }
  );

  public loginAdmin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { password, email } = req.body;
      if (!email || !password) {
        return next(new AppError('Please enter your email or password', 400));
      }

      const admin = await this.authService.adminLogin(email, password);

      sendToken(admin, 200, req, res);
    }
  );

  public forgetPasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const user = await this.authService.forgetUserPassword(email);

      const token = signToken({ id: user.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'please check your email for reset code ',
      });
    }
  );

  public verifyResetCodeUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { resetCode } = req.body;

      const userCount = await this.userRepository.findOne({
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

      const user = await this.authService.verifyUserResetCode(resetCode);

      const token = signToken({ id: user.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'ResetCode verify successfully',
      });
    }
  );

  public resetPasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userRepository.findOne({
        where: { id: (req as CustomRequest).user.id },
      });

      if (!user) {
        return next(new AppError(`There is no user found`, 404));
      }

      const { password } = req.body;

      await this.authService.resetUserPassword(user.id, password);

      res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
      });
    }
  );

  public forgetPasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const doctor = await this.authService.forgetDoctorPassword(email);

      const token = signToken({ id: doctor.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'please check your email for reset code ',
      });
    }
  );

  public verifyResetCodeDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { resetCode } = req.body;

      const doctorCount = await this.doctorRepository.findOne({
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

      const doctor = await this.authService.verifyDoctorResetCode(resetCode);

      const token = signToken({ id: doctor.id });

      res.status(200).json({
        status: 'success',
        token,
        message: 'ResetCode verify successfully',
      });
    }
  );

  public resetPasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await this.doctorRepository.findOne({
        where: { id: (req as CustomRequest).doctor.id },
      });

      if (!doctor) {
        return next(new AppError(`There is no doctor found`, 404));
      }

      const { password } = req.body;

      await this.authService.resetDoctorPassword(doctor.id, password);

      res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
      });
    }
  );

  public updatePasswordUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userRepository.findOne({
        where: { id: (req as CustomRequest).user.id },
      });

      if (!user) {
        return next(new AppError(`There is no user found`, 404));
      }

      const { passwordCurrent, password } = req.body;

      const userUpdate = await this.authService.updateUserPassword(
        user.id,
        passwordCurrent,
        password
      );

      sendToken(userUpdate, 200, req, res);
    }
  );

  public updatePasswordDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await this.doctorRepository.findOne({
        where: { id: (req as CustomRequest).doctor.id },
      });

      if (!doctor) {
        return next(new AppError(`There is no doctor found`, 404));
      }

      const { passwordCurrent, password } = req.body;

      const doctorUpdate = await this.authService.updateDoctorPassword(
        doctor.id,
        passwordCurrent,
        password
      );

      sendToken(doctorUpdate, 200, req, res);
    }
  );
}

const authController = new AuthController(AppDataSource, authService);
export default authController;
