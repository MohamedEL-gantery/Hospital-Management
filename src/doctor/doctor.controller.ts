import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { Doctor } from '../entities/doctor';
import doctorService, { DoctorService } from './doctor.service';
import CustomRequest from './../interfaces/customRequest';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';

class DoctorController {
  private doctorRepository;

  constructor(
    private dataSource: DataSource,
    private readonly doctorService: DoctorService
  ) {
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = (req as CustomRequest).doctor.id;
    next();
  };

  public topFiveDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await this.doctorRepository
        .createQueryBuilder('doctor')
        .orderBy('doctor.ratingsAverage', 'DESC')
        .limit(5)
        .getMany();

      res.status(200).json({
        status: 'success',
        data: doctor,
      });
    }
  );

  public getAllDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctors = await this.doctorService.getAll();

      res.status(200).json({
        status: 'success',
        result: doctors.length,
        data: doctors,
      });
    }
  );

  public getOneDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const doctor = await this.doctorService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: doctor,
      });
    }
  );

  public updateOneDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let photo;

      // If a file is uploaded, process it
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          `../upload/images${req.file.filename}`
        );
        const uploadPhoto = await cloudinaryUploadSingleImag(imagePath);
        photo = uploadPhoto.secure_url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(imagePath);
      }

      const {
        name,
        email,
        phoneNumber,
        country,
        city,
        address,
        birthDate,
        aboutMe,
        gender,
        price,
        clinicName,
        clinicAddress,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl,
        category,
      } = req.body;

      const doctor = await this.doctorService.updateOne(
        req.params.id,
        name,
        email,
        phoneNumber,
        photo,
        country,
        city,
        address,
        birthDate,
        aboutMe,
        gender,
        price,
        clinicName,
        clinicAddress,
        facebookUrl,
        twitterUrl,
        instagramUrl,
        youtubeUrl,
        linkedinUrl,
        category
      );

      res.status(200).json({
        status: 'success',
        data: doctor,
      });
    }
  );

  public deleteOneDoctor = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.doctorService.deleteOne((req as CustomRequest).doctor.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  public searchByName = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.body;

      const doctors = await this.doctorService.search(name);

      res.status(200).json({
        status: 'success',
        data: doctors,
      });
    }
  );
}

const doctorController = new DoctorController(AppDataSource, doctorService);
export default doctorController;
