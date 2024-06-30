import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorClinicPhotoService from './doctorClinicPhoto.service';
import { cloudinaryUploadSingleImag } from './../../utils/cloudinary';
import CustomRequest from './../../interfaces/customRequest';

class DoctorClinicPhotoController {
  createDoctorClinicPhoto = asyncHandler(
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
      const data = await doctorClinicPhotoService.create(doctor, photo);

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  getAllDoctorsClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorClinicPhotoService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorClinicPhotoService.getAllPhotos(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getOneDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorClinicPhotoService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  updateOneDoctorClinicPhoto = asyncHandler(
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

      const data = await doctorClinicPhotoService.updateOne(
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

  deleteOneDoctorClinicPhoto = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await doctorClinicPhotoService.deleteOne(
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

const doctorClinicPhotoController = new DoctorClinicPhotoController();
export default doctorClinicPhotoController;
