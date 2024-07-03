import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entities/doctor';
import { DoctorClinicPhoto } from '../../entities/doctorClinicPhoto';
import AppError from '../../utils/appError';
import { DataSource } from 'typeorm';

export class DoctorClinicPhotoService {
  private doctorClinicPhotoRepository;
  private doctorRepository;

  constructor(private dataSource: DataSource) {
    this.doctorClinicPhotoRepository =
      this.dataSource.getRepository(DoctorClinicPhoto);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
  }

  public create = async (doctor: any, photo: any) => {
    const newPhoto = this.doctorClinicPhotoRepository.create({
      doctor: { id: doctor },
      photo,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newPhoto.save();

    return newPhoto;
  };

  public getAll = async () => {
    const data = await this.doctorClinicPhotoRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  public getAllPhotos = async (doctor: any) => {
    const data = await this.doctorClinicPhotoRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  public getOne = async (id: any) => {
    const data = await this.doctorClinicPhotoRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  public updateOne = async (id: any, doctor: any, photo: any) => {
    const data = await this.doctorClinicPhotoRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    data.photo = photo || data.photo;
    await data.save();

    return data;
  };

  public deleteOne = async (id: any, doctor: any) => {
    const data = await this.doctorClinicPhotoRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorClinicPhotoService = new DoctorClinicPhotoService(AppDataSource);
export default doctorClinicPhotoService;
