import crypto from 'crypto';
import 'express-async-errors';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { User } from '../entities/user';
import { Doctor } from '../entities/doctor';
import AppError from '../utils/appError';
import { Roles } from '../enum/roles';
import sendEmail from '../utils/sendEmail';
import { MoreThan } from 'typeorm';

export class AuthService {
  private userRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public userSignup = async (name: string, email: string, password: string) => {
    const newUser = this.userRepository.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    });

    const userFound = await this.userRepository.findOne({
      where: { email },
    });
    if (userFound) {
      throw new AppError('User Already Exists', 400);
    }

    await this.userRepository.save(newUser);

    return newUser;
  };

  public doctorSignup = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    const newDoctor = this.doctorRepository.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      phoneNumber,
    });

    const doctorFound = await this.doctorRepository.findOne({
      where: { email },
    });
    if (doctorFound) {
      throw new AppError('Doctor Already Exists', 400);
    }

    await this.doctorRepository.save(newDoctor);

    return newDoctor;
  };

  public userLogin = async (
    password: string,
    email?: string,
    phoneNumber?: string
  ) => {
    if ((email && phoneNumber) || (!email && !phoneNumber)) {
      throw new AppError(
        'Please provide either email or phoneNumber, but not both',
        400
      );
    }

    let user;
    if (email) {
      user = await this.userRepository.findOne({ where: { email } });
    }

    if (phoneNumber) {
      user = await this.userRepository.findOne({
        where: { phoneNumber: phoneNumber },
      });
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError('Invalid email or phoneNumber or password', 401);
    }

    if (user.role !== Roles.user) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    return user;
  };

  public doctorLogin = async (
    password: string,
    email?: string,
    phoneNumber?: string
  ) => {
    if ((email && phoneNumber) || (!email && !phoneNumber)) {
      throw new AppError(
        'Please provide either email or phoneNumber, but not both',
        400
      );
    }

    let doctor;

    if (email) {
      doctor = await this.doctorRepository.findOne({ where: { email } });
    }

    if (phoneNumber) {
      doctor = await this.doctorRepository.findOne({
        where: { phoneNumber: phoneNumber },
      });
    }

    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      throw new AppError('Invalid email or phoneNumber or password', 401);
    }

    if (doctor.role !== Roles.doctor) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    return doctor;
  };

  public adminLogin = async (email: string, password: string) => {
    const admin = await this.userRepository.findOne({ where: { email } });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new AppError('invalid email or password', 401);
    }

    if (admin.role !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    return admin;
  };

  public forgetUserPassword = async (email: string) => {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Email not found', 404);
    }

    const resetCode = user.generateVerificationCode();
    user.countPassword = 0;

    await user.save();

    const date = new Date();
    const dateString = date.toLocaleTimeString('en-EG');
    const message = `Hi ${user?.name},\n We received a request to reset the password on your hospital Account in ${dateString}. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Hospital Team`;

    try {
      sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });

      return user;
    } catch (err) {
      user.passwordResetCode = null;
      user.passwordResetExpires = null;
      user.passwordResetVerified = null;
      await user.save();

      throw new AppError(
        'There was an error sending the email. Try again later!',
        500
      );
    }
  };

  public verifyUserResetCode = async (restCode: string) => {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(restCode)
      .digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new AppError('Reset Code Is Invalid Or Expired', 400);
    }

    user.passwordResetVerified = true;
    user.countPassword = 0;

    await user.save();

    return user;
  };

  public resetUserPassword = async (id: string, password: string) => {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      if (user.passwordResetVerified !== true && user.countPassword !== 0) {
        throw new AppError('Reset code not verified', 400);
      }

      user.password = await bcrypt.hash(password, 12);
      user.passwordResetCode = null;
      user.passwordResetExpires = null;
      user.passwordResetVerified = null;
      user.passwordChangedAt = new Date();

      await user.save();
    }
  };

  public forgetDoctorPassword = async (email: string) => {
    const doctor = await this.doctorRepository.findOne({ where: { email } });

    if (!doctor) {
      throw new AppError('Email not found', 404);
    }

    const resetCode = doctor.generateVerificationCode();
    doctor.countPassword = 0;

    await doctor.save();

    const date = new Date();
    const dateString = date.toLocaleTimeString('en-EG');
    const message = `Hi Doctor ${doctor?.name},\n We received a request to reset the password on your hospital Account in ${dateString}. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The Hospital Team`;

    try {
      sendEmail({
        email: doctor.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });

      return doctor;
    } catch (err) {
      doctor.passwordResetCode = null;
      doctor.passwordResetExpires = null;
      doctor.passwordResetVerified = null;
      await doctor.save();

      throw new AppError(
        'There was an error sending the email. Try again later!',
        500
      );
    }
  };

  public verifyDoctorResetCode = async (restCode: string) => {
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(restCode)
      .digest('hex');

    const doctor = await this.doctorRepository.findOne({
      where: {
        passwordResetCode: hashedResetCode,
        passwordResetExpires: MoreThan(new Date()),
      },
    });

    if (!doctor) {
      throw new AppError('Reset Code Is Invalid Or Expired', 400);
    }

    doctor.passwordResetVerified = true;
    doctor.countPassword = 0;

    await doctor.save();

    return doctor;
  };

  public resetDoctorPassword = async (id: string, password: string) => {
    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (doctor) {
      if (doctor.passwordResetVerified !== true && doctor.countPassword !== 0) {
        throw new AppError('Reset code not verified', 400);
      }

      doctor.password = await bcrypt.hash(password, 12);
      doctor.passwordResetCode = null;
      doctor.passwordResetExpires = null;
      doctor.passwordResetVerified = null;
      doctor.passwordChangedAt = new Date();

      await doctor.save();
    }
  };

  public updateUserPassword = async (
    id: string,
    passwordCurrent: string,
    password: string
  ) => {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) {
      if (!(await bcrypt.compare(passwordCurrent, user.password))) {
        throw new AppError(' Your current password is wrong', 401);
      }

      user.password = await bcrypt.hash(password, 12);
      user.passwordChangedAt = new Date();

      await user.save();

      return user;
    }
  };

  public updateDoctorPassword = async (
    id: string,
    passwordCurrent: string,
    password: string
  ) => {
    const doctor = await this.doctorRepository.findOne({ where: { id } });

    if (doctor) {
      if (!(await bcrypt.compare(passwordCurrent, doctor.password))) {
        throw new AppError(' Your current password is wrong', 401);
      }

      doctor.password = await bcrypt.hash(password, 12);
      doctor.passwordChangedAt = new Date();

      await doctor.save();

      return doctor;
    }
  };
}

const authService = new AuthService(AppDataSource);
export default authService;
