import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entity/doctor';
import { Calender } from '../../entity/doctorCalender';
import AppError from '../../utils/appError';
import { Day } from '../../enum/day';

const calenderRepository = AppDataSource.getRepository(Calender);
const doctorRepository = AppDataSource.getRepository(Doctor);

class CalenderService {
  create = async (
    doctor: any,
    day: Day,
    date: Date,
    dateOfStart: string,
    dateOfEnd: string,
    duration: string,
    price: number
  ) => {
    const newCalender = calenderRepository.create({
      doctor: { id: doctor },
      day,
      date,
      dateOfStart,
      dateOfEnd,
      duration,
      price,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    const calenderExist = await calenderRepository.findOne({
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

  getAll = async () => {
    const data = await calenderRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  getAllPaid = async () => {
    const data = await calenderRepository.find({
      where: { paid: true },
      relations: ['doctor'],
    });
    return data;
  };

  getMyPaidCalender = async (doctor:any) => {
    const data = await calenderRepository.find({
      where: { doctor: { id: doctor } ,paid: true },
      relations: ['doctor'],
    });
    return data;
  };

  getMyCalender = async (doctor: any) => {
    const data = await calenderRepository.find({
      where: { doctor: { id: doctor }},
      relations: ['doctor'],
    });
    return data;
  };

  getAllCalender = async (doctor: any) => {
    const data = await calenderRepository.find({
      where: { doctor: { id: doctor },paid:false},
      relations: ['doctor'],
    });
    return data;
  };

  getOne = async (id: any, doctor: any) => {
    const data = await calenderRepository.findOne({
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

  updateOne = async (
    id: any,
    doctor: any,
    day?: Day,
    date?: Date,
    dateOfStart?: string,
    dateOfEnd?: string,
    duration?: string,
    price?: number
  ) => {
    const data = await calenderRepository.findOne({
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

  deleteOne = async (id: any, doctor: any) => {
    const data = await calenderRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const calenderService = new CalenderService();
export default calenderService;
