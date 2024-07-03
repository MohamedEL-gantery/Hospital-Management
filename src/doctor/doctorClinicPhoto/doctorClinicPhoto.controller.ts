import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorClinicPhotoService, {
  DoctorClinicPhotoService,
} from './doctorClinicPhoto.service';
import { cloudinaryUploadSingleImag } from './../../utils/cloudinary';
import CustomRequest from './../../interfaces/customRequest';

class DoctorClinicPhotoController {
  constructor(
    private readonly doctorClinicPhotoService: DoctorClinicPhotoService
  ) {}

  public createDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      let photo;

      // If a file is uploaded, process it
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          `../../public/images/${req.file.filename}`
        );
        const uploadPhoto = await cloudinaryUploadSingleImag(imagePath);
        photo = uploadPhoto.secure_url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(imagePath);
      }

      const { doctor } = req.body;
      const data = await this.doctorClinicPhotoService.create(doctor, photo);

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  public getAllDoctorsClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorClinicPhotoService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorClinicPhotoService.getAllPhotos(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getOneDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorClinicPhotoService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let photo: any;

      // If a file is uploaded, process it
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          `../../public/images/${req.file.filename}`
        );
        const uploadPhoto = await cloudinaryUploadSingleImag(imagePath);
        photo = uploadPhoto.secure_url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(imagePath);
      }

      const data = await this.doctorClinicPhotoService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        photo
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public deleteOneDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.doctorClinicPhotoService.deleteOne(
        req.params.id,
        (req as CustomRequest).doctor.id
      );

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}

const doctorClinicPhotoController = new DoctorClinicPhotoController(
  doctorClinicPhotoService
);
export default doctorClinicPhotoController;
