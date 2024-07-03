import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import doctorEducationService, {
  DoctorEducationService,
} from './doctorEducation.service';
import CustomRequest from './../../interfaces/customRequest';

class DoctorEducationController {
  constructor(
    private readonly doctorEducationService: DoctorEducationService
  ) {}

  public createDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, degree, college, yearOfCompletion } = req.body;
      const data = await this.doctorEducationService.create(
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

  public getAllDoctorsEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorEducationService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorEducations = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorEducationService.getAllEducations(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.doctorEducationService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { degree, college, yearOfCompletion } = req.body;

      const data = await this.doctorEducationService.updateOne(
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

  public deleteOneDoctorEducation = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.doctorEducationService.deleteOne(
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

const doctorEducationController = new DoctorEducationController(
  doctorEducationService
);
export default doctorEducationController;
