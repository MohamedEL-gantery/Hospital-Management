import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorExperienceService, {
  DoctorExperienceService,
} from './doctorExperience.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorExperienceController {
  constructor(
    private readonly doctorExperienceService: DoctorExperienceService
  ) {}

  public createDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, hospitalName, from, to, designation } = req.body;
      const data = await this.doctorExperienceService.create(
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

  public getAllDoctorsExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorExperienceService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorExperienceService.getAllExperience(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorExperienceService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { hospitalName, from, to, designation } = req.body;

      const data = await this.doctorExperienceService.updateOne(
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

  public deleteOneDoctorExperience = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.doctorExperienceService.deleteOne(
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

const doctorExperienceController = new DoctorExperienceController(
  doctorExperienceService
);
export default doctorExperienceController;
