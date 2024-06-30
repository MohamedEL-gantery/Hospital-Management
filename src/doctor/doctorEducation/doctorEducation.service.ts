import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entity/doctor';
import { DoctorEducation } from './../../entity/doctorEducation';
import AppError from '../../utils/appError';

const doctorEducationRepository = AppDataSource.getRepository(DoctorEducation);
const doctorRepository = AppDataSource.getRepository(Doctor);

class DoctorEducationService {
  create = async (
    doctor: any,
    degree: string,
    college: string,
    yearOfCompletion: Date
  ) => {
    const newEducation = doctorEducationRepository.create({
      doctor: { id: doctor },
      degree,
      college,
      yearOfCompletion,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newEducation.save();

    return newEducation;
  };

  getAll = async () => {
    const data = await doctorEducationRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  getAllEducations = async (doctor: any) => {
    const data = await doctorEducationRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  getOne = async (id: any) => {
    const data = await doctorEducationRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  updateOne = async (
    id: any,
    doctor: any,
    degree?: string,
    college?: string,
    yearOfCompletion?: Date
  ) => {
    const data = await doctorEducationRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.degree = degree || data.degree;
    data.college = college || data.college;
    data.yearOfCompletion = yearOfCompletion || data.yearOfCompletion;

    await data.save();

    return data;
  };

  deleteOne = async (id: any, doctor: any) => {
    const data = await doctorEducationRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorEducationService = new DoctorEducationService();
export default doctorEducationService;
