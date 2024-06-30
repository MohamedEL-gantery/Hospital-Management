import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorExperienceService from './doctorExperience.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorExperienceController {
  createDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, hospitalName, from, to, designation } = req.body;
      const data = await doctorExperienceService.create(
        doctor,
        hospitalName,
        from,
        to,
        designation
      );

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  getAllDoctorsExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorExperienceService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorExperienceService.getAllExperience(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorExperienceService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );
  updateOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { hospitalName, from, to, designation } = req.body;

      const data = await doctorExperienceService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        hospitalName,
        from,
        to,
        designation
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  deleteOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await doctorExperienceService.deleteOne(
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

const doctorExperienceController = new DoctorExperienceController();
export default doctorExperienceController;
