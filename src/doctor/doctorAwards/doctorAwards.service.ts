import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entity/doctor';
import { DoctorAwards } from './../../entity/doctorAwards';
import AppError from '../../utils/appError';

const doctorAwardsRepository = AppDataSource.getRepository(DoctorAwards);
const doctorRepository = AppDataSource.getRepository(Doctor);

class DoctorAwardsService {
  create = async (doctor: any, awards: string, year: Date) => {
    const newAwards = doctorAwardsRepository.create({
      doctor: { id: doctor },
      awards,
      year,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newAwards.save();

    return newAwards;
  };

  getAll = async () => {
    const data = await doctorAwardsRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  getAllAwards = async (doctor: any) => {
    const data = await doctorAwardsRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  getOne = async (id: any) => {
    const data = await doctorAwardsRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  updateOne = async (id: any, doctor: any, awards?: string, year?: Date) => {
    const data = await doctorAwardsRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.awards = awards || data.awards;
    data.year = year || data.year;

    await data.save();

    return data;
  };

  deleteOne = async (id: any, doctor: any) => {
    const data = await doctorAwardsRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorAwardsService = new DoctorAwardsService();
export default doctorAwardsService;
