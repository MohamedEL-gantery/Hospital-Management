import 'express-async-errors';
import { AppDataSource } from '../../db';
import { Doctor } from '../../entity/doctor';
import { DoctorClinicPhoto } from './../../entity/doctorClinicPhoto';
import AppError from '../../utils/appError';

const doctorClinicPhotoRepository =
  AppDataSource.getRepository(DoctorClinicPhoto);
const doctorRepository = AppDataSource.getRepository(Doctor);

class DoctorClinicPhotoService {
  create = async (doctor: any, photo: any) => {
    const newPhoto = doctorClinicPhotoRepository.create({
      doctor: { id: doctor },
      photo,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    await newPhoto.save();

    return newPhoto;
  };

  getAll = async () => {
    const data = await doctorClinicPhotoRepository.find({
      relations: ['doctor'],
    });
    return data;
  };

  getAllPhotos = async (doctor: any) => {
    const data = await doctorClinicPhotoRepository.find({
      where: { doctor: { id: doctor } },
      relations: ['doctor'],
    });
    return data;
  };

  getOne = async (id: any) => {
    const data = await doctorClinicPhotoRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    return data;
  };

  updateOne = async (id: any, doctor: any, photo: any) => {
    const data = await doctorClinicPhotoRepository.findOne({
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

  deleteOne = async (id: any, doctor: any) => {
    const data = await doctorClinicPhotoRepository.findOne({
      where: { id, doctor: { id: doctor } },
      relations: ['doctor'],
    });

    if (!data) {
      throw new AppError('Data not found', 404);
    }

    await data.remove();
  };
}

const doctorClinicPhotoService = new DoctorClinicPhotoService();
export default doctorClinicPhotoService;
