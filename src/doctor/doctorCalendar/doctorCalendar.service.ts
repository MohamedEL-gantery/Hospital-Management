import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entities/doctor';
import { Calender } from '../../entities/doctorCalender';
import AppError from '../../utils/appError';
import { Day } from '../../enum/day';
import { DataSource } from 'typeorm';

export class CalenderService {
  private calenderRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.calenderRepository = this.dataSource.getRepository(Calender);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public create = async (
    doctor: any,
    day: Day,
    date: Date,
    dateOfStart: string,
    dateOfEnd: string,
    duration: string,
    price: number
  ) => {
    const newCalender = this.calenderRepository.create({
      doctor: { id: doctor },
      day,
      date,
      dateOfStart,
      dateOfEnd,
      duration,
      price,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    const calenderExist = await this.calenderRepository.findOne({
      where: {
        doctor: { id: doctor },
        day: day,
        dateOfStart: dateOfStart,
        dateOfEnd: dateOfEnd,
        date: date,
      },
    });

    if (calenderExist) {
      throw new AppError('This date is already exist', 400);
    }

    await newCalender.save();

    return newCalender;
  };

  public getAll = async () => {
    const data = await this.calenderRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  public getAllPaid = async () => {
    const data = await this.calenderRepository.find({
      where: { paid: true },
      relations: ['doctor'],
    });
    return data;
  };

  public getMyPaidCalender = async (doctor: any) => {
    const data = await this.calenderRepository.find({
      where: { doctor: { id: doctor }, paid: true },
      relations: ['doctor'],
    });
    return data;
  };

  public getMyCalender = async (doctor: any) => {
    const data = await this.calenderRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  public getAllCalender = async (doctor: any) => {
    const data = await this.calenderRepository.find({
      where: { doctor: { id: doctor }, paid: false },
      relations: ['doctor'],
    });
    return data;
  };

  public getOne = async (id: any, doctor: any) => {
    const data = await this.calenderRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    if (data.paid === true) {
      if (data.doctor.id === doctor) {
        return data;
      } else {
        throw new AppError('This is already paid', 400);
      }
    }
    return data;
  };

  public updateOne = async (
    id: any,
    doctor: any,
    day?: Day,
    date?: Date,
    dateOfStart?: string,
    dateOfEnd?: string,
    duration?: string,
    price?: number
  ) => {
    const data = await this.calenderRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.day = day || data.day;
    data.date = date || data.date;
    data.dateOfStart = dateOfStart || data.dateOfStart;
    data.dateOfEnd = dateOfEnd || data.dateOfEnd;
    data.duration = duration || data.duration;
    data.price = price || data.price;

    await data.save();

    return data;
  };

  public deleteOne = async (id: any, doctor: any) => {
    const data = await this.calenderRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const calenderService = new CalenderService(AppDataSource);
export default calenderService;
