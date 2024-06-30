import 'express-async-errors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import AppError from './appError';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryRemoveImage = async (imagePublicId: any) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);

    return result;
  } catch (err) {
    throw new AppError(err as string, 400);
  }
};

export const cloudinaryUploadSingleImag = async (imagePath: any) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath);
    //console.log('Image uploaded successfully:', result);

    return result;
  } catch (err) {
    throw new AppError(err as string, 400);
  }
};
