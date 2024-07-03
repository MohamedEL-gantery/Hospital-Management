import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorAwardsService, {
  DoctorAwardsService,
} from './doctorAwards.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorAwardsController {
  constructor(private readonly doctorAwardsService: DoctorAwardsService) {}

  public createDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, awards, year } = req.body;
      const data = await this.doctorAwardsService.create(doctor, awards, year);

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  public getAllDoctorsAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorAwardsService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorAwardsService.getAllAwards(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorAwardsService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { awards, year } = req.body;

      const data = await this.doctorAwardsService.updateOne(
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

  public deleteOneDoctorAwards = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.doctorAwardsService.deleteOne(
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

const doctorAwardsController = new DoctorAwardsController(doctorAwardsService);
export default doctorAwardsController;
