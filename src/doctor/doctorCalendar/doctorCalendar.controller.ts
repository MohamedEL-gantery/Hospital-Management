import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import calenderService, { CalenderService } from './doctorCalendar.service';
import CustomRequest from './../../interfaces/customRequest';

class CalenderController {
  constructor(private readonly calenderService: CalenderService) {}

  public createCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, day, date, dateOfStart, dateOfEnd, duration, price } =
        req.body;
      const data = await this.calenderService.create(
        doctor,
        day,
        date,
        dateOfStart,
        dateOfEnd,
        duration,
        price
      );

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  public getAllDoctorsCalenders = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorsCalendersPaid = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getAllPaid();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorCalendersPaid = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getMyPaidCalender(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllDoctorCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getMyCalender(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getAllOneDoctorCalenders = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getAllCalender(req.params.id);

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  public getOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.calenderService.getOne(
        req.params.id,
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { day, date, dateOfStart, dateOfEnd, duration, price } = req.body;

      const data = await this.calenderService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        day,
        date,
        dateOfStart,
        dateOfEnd,
        duration,
        price
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public deleteOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.calenderService.deleteOne(
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

const calenderController = new CalenderController(calenderService);
export default calenderController;
