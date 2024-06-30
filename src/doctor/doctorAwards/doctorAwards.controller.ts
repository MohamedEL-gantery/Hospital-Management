import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorAwardsService from './doctorAwards.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorAwardsController {
  createDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, awards, year } = req.body;
      const data = await doctorAwardsService.create(doctor, awards, year);

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  getAllDoctorsAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorAwardsService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorAwardsService.getAllAwards(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await doctorAwardsService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  updateOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { awards, year } = req.body;

      const data = await doctorAwardsService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        awards,
        year
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  deleteOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await doctorAwardsService.deleteOne(
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

const doctorAwardsController = new DoctorAwardsController();
export default doctorAwardsController;
