import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import calenderService from './doctorCalendar.service';
import CustomRequest from './../../interfaces/customRequest';

class CalenderController {
  createCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, day, date, dateOfStart, dateOfEnd, duration, price } =
        req.body;
      const data = await calenderService.create(
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

  getAllDoctorsCalenders = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorsCalendersPaid = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getAllPaid();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );


  getAllDoctorCalendersPaid = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getMyPaidCalender((req as CustomRequest).doctor.id)

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllDoctorCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getMyCalender(
        (req as CustomRequest).doctor.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getAllOneDoctorCalenders = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getAllCalender(req.params.id);

      res.status(200).json({
        status: 'success',
        result: data.length,
        data: data,
      });
    }
  );

  getOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await calenderService.getOne(req.params.id,(req as CustomRequest).doctor.id);

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  updateOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { day, date, dateOfStart, dateOfEnd, duration, price } = req.body;

      const data = await calenderService.updateOne(
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

  deleteOneCalender = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await calenderService.deleteOne(
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

const calenderController = new CalenderController();
export default calenderController;
