import 'express-async-errors';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entities/doctor';
import { DoctorAwards } from '../../entities/doctorAwards';
import AppError from '../../utils/appError';

export class DoctorAwardsService {
  private doctorAwardsRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.doctorAwardsRepository = this.dataSource.getRepository(DoctorAwards);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public create = async (doctor: any, awards: string, year: Date) => {
    const newAwards = this.doctorAwardsRepository.create({
      doctor: { id: doctor },
      awards,
      year,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newAwards.save();

    return newAwards;
  };

  public getAll = async () => {
    const data = await this.doctorAwardsRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  public getAllAwards = async (doctor: any) => {
    const data = await this.doctorAwardsRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  public getOne = async (id: any) => {
    const data = await this.doctorAwardsRepository.findOne({
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
    awards?: string,
    year?: Date
  ) => {
    const data = await this.doctorAwardsRepository.findOne({
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

  public deleteOne = async (id: any, doctor: any) => {
    const data = await this.doctorAwardsRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorAwardsService = new DoctorAwardsService(AppDataSource);
export default doctorAwardsService;
