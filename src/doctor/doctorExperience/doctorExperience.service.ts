import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entity/doctor';
import { DoctorExperience } from '../../entity/doctorExperience';
import AppError from '../../utils/appError';

const doctorExperienceRepository =
  AppDataSource.getRepository(DoctorExperience);
const doctorRepository = AppDataSource.getRepository(Doctor);

class DoctorExperienceService {
  create = async (
    doctor: any,
    hospitalName: string,
    from: Date,
    to: Date,
    designation: string
  ) => {
    const newExperience = doctorExperienceRepository.create({
      doctor: { id: doctor },
      hospitalName,
      from,
      to,
      designation,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newExperience.save();

    return newExperience;
  };

  getAll = async () => {
    const data = await doctorExperienceRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  getAllExperience = async (doctor: any) => {
    const data = await doctorExperienceRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  getOne = async (id: any) => {
    const data = await doctorExperienceRepository.findOne({
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
    hospitalName?: string,
    from?: Date,
    to?: Date,
    designation?: string
  ) => {
    const data = await doctorExperienceRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.hospitalName = hospitalName || data.hospitalName;
    data.designation = designation || data.designation;
    data.from = from || data.from;
    data.to = to || data.to;

    await data.save();

    return data;
  };

  deleteOne = async (id: any, doctor: any) => {
    const data = await doctorExperienceRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorExperienceService = new DoctorExperienceService();
export default doctorExperienceService;
