import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorEducationService from './doctorEducation.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorEducationController {
  createDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, degree, college, yearOfCompletion } = req.body;
      const data = await doctorEducationService.create(
        doctor,
        degree,
        college,
        yearOfCompletion
      );

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  getAllDoctorsEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorEducationService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorEducations = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorEducationService.getAllEducations(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorEducationService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  updateOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { degree, college, yearOfCompletion } = req.body;

      const data = await doctorEducationService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        degree,
        college,
        yearOfCompletion
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  deleteOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await doctorEducationService.deleteOne(
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

const doctorEducationController = new DoctorEducationController();
export default doctorEducationController;
