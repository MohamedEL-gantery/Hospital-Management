import 'express-async-errors';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entities/doctor';
import { DoctorEducation } from '../../entities/doctorEducation';
import AppError from '../../utils/appError';

export class DoctorEducationService {
  private doctorEducationRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.doctorEducationRepository =
      this.dataSource.getRepository(DoctorEducation);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public create = async (
    doctor: any,
    degree: string,
    college: string,
    yearOfCompletion: Date
  ) => {
    const newEducation = this.doctorEducationRepository.create({
      doctor: { id: doctor },
      degree,
      college,
      yearOfCompletion,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newEducation.save();

    return newEducation;
  };

  public getAll = async () => {
    const data = await this.doctorEducationRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  public getAllEducations = async (doctor: any) => {
    const data = await this.doctorEducationRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  public getOne = async (id: any) => {
    const data = await this.doctorEducationRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  public updateOne = async (
    id: any,
    doctor: any,
    degree?: string,
    college?: string,
    yearOfCompletion?: Date
  ) => {
    const data = await this.doctorEducationRepository.findOne({
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

  public deleteOne = async (id: any, doctor: any) => {
    const data = await this.doctorEducationRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorEducationService = new DoctorEducationService(AppDataSource);
export default doctorEducationService;
