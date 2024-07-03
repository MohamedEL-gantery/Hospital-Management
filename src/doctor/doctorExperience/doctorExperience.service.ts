import 'express-async-errors';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entities/doctor';
import { DoctorExperience } from '../../entities/doctorExperience';
import AppError from '../../utils/appError';

export class DoctorExperienceService {
  private doctorExperienceRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.doctorExperienceRepository =
      this.dataSource.getRepository(DoctorExperience);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public create = async (
    doctor: any,
    hospitalName: string,
    from: Date,
    to: Date,
    designation: string
  ) => {
    const newExperience = this.doctorExperienceRepository.create({
      doctor: { id: doctor },
      hospitalName,
      from,
      to,
      designation,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newExperience.save();

    return newExperience;
  };

  public getAll = async () => {
    const data = await this.doctorExperienceRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  public getAllExperience = async (doctor: any) => {
    const data = await this.doctorExperienceRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  public getOne = async (id: any) => {
    const data = await this.doctorExperienceRepository.findOne({
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
    hospitalName?: string,
    from?: Date,
    to?: Date,
    designation?: string
  ) => {
    const data = await this.doctorExperienceRepository.findOne({
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

  public deleteOne = async (id: any, doctor: any) => {
    const data = await this.doctorExperienceRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorExperienceService = new DoctorExperienceService(AppDataSource);
export default doctorExperienceService;
