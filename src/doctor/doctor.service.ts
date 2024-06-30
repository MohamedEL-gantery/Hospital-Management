import 'express-async-errors';
import { AppDataSource } from '../db';
import { Doctor } from '../entity/doctor';
import { Category } from '../entity/category';
import AppError from '../utils/appError';
import { Gender } from '../enum/gender';
import { Pricing } from '../enum/pricing';
import { Like } from 'typeorm';

const doctorRepository = AppDataSource.getRepository(Doctor);
const categoryRepository = AppDataSource.getRepository(Category);

class DoctorService {
  getAll = async () => {
    const doctors = await doctorRepository.find({
      relations: [
        'category',
        'blogs',
        'experiences',
        'educations',
        'awards',
        'clinicPhotos',
        'availableTime',
        'review.user',
      ],
    });
    return doctors;
  };

  getOne = async (id: any) => {
    const doctor = await doctorRepository.findOne({
      where: { id },
      relations: [
        'category',
        'blogs',
        'experiences',
        'educations',
        'awards',
        'clinicPhotos',
        'availableTime',
        'review.user',
      ],
    });

    if (!doctor) {
      throw new AppError('doctor not found', 404);
    }

    return doctor;
  };

  updateOne = async (
    id: any,
    name?: string,
    email?: string,
    phoneNumber?: string,
    photo?: string,
    country?: string,
    city?: string,
    address?: string,
    birthDate?: Date,
    aboutMe?: string,
    gender?: Gender,
    price?: Pricing,
    clinicName?: string,
    clinicAddress?: string,
    facebookUrl?: string,
    twitterUrl?: string,
    instagramUrl?: string,
    youtubeUrl?: string,
    linkedinUrl?: string,
    category?: any
  ) => {
    const doctor = await doctorRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new AppError('doctor not found', 404);
    }

    doctor.name = name || doctor.name;
    (doctor.email = email || doctor.email),
      (doctor.phoneNumber = phoneNumber || doctor.phoneNumber),
      (doctor.photo = photo || doctor.photo),
      (doctor.country = country || doctor.country),
      (doctor.city = city || doctor.city);
    doctor.address = address || doctor.address;
    doctor.birthDate = birthDate || doctor.birthDate;
    doctor.aboutMe = aboutMe || doctor.aboutMe;
    doctor.gender = gender || doctor.gender;
    doctor.price = price || doctor.price;
    doctor.clinicName = clinicName || doctor.clinicName;
    doctor.clinicAddress = clinicAddress || doctor.clinicAddress;
    doctor.facebookUrl = facebookUrl || doctor.facebookUrl;
    doctor.twitterUrl = twitterUrl || doctor.twitterUrl;
    doctor.instagramUrl = instagramUrl || doctor.instagramUrl;
    doctor.youtubeUrl = youtubeUrl || doctor.youtubeUrl;
    (doctor.linkedinUrl = linkedinUrl || doctor.linkedinUrl),
      (doctor.category = category || doctor.category);

    if (category) {
      const categoryExist = await categoryRepository.findOne({
        where: { id: category },
      });

      if (!categoryExist) {
        throw new AppError('Category not found', 404);
      }
    }

    await doctor.save();

    return doctor;
  };

  deleteOne = async (id: any) => {
    const doctor = await doctorRepository.findOne({ where: { id } });

    if (!doctor) {
      throw new AppError('doctor not found', 404);
    }

    await doctor.remove();
  };

  search = async (name: string) => {
    const doctor = await doctorRepository.find({
      where: { name: Like(`%${name}%`) },
    });

    if (!doctor) {
      throw new AppError('doctor not found', 404);
    }

    return doctor;
  };
}

const doctorService = new DoctorService();
export default doctorService;
