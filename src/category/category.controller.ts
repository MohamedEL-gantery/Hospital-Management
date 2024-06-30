import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';
import categoryService from './category.service';

class CategoryController {
  createCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let photo;

      // If a file is uploaded, process it
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          `../upload/images${req.file.filename}`
        );
        const uploadPhoto = await cloudinaryUploadSingleImag(imagePath);
        photo = uploadPhoto.secure_url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(imagePath);
      }
      const { name } = req.body;
      const newCategory = await categoryService.create(name, photo);

      res.status(201).json({
        status: 'success',
        data: newCategory,
      });
    }
  );

  getAllCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories = await categoryService.find();

      res.status(200).json({
        status: 'success',
        result: categories.length,
        data: categories,
      });
    }
  );

  getOneCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await categoryService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    }
  );

  updateOneCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let photo;

      // If a file is uploaded, process it
      if (req.file) {
        const imagePath = path.join(
          __dirname,
          `../public/images/${req.file.filename}`
        );
        const uploadPhoto = await cloudinaryUploadSingleImag(imagePath);
        photo = uploadPhoto.secure_url;

        // Clean up the local file after uploading to Cloudinary
        fs.unlinkSync(imagePath);
      }
      const { name } = req.body;

      const category = await categoryService.updateOne(
        req.params.id,
        name,
        photo
      );

      res.status(200).json({
        status: 'success',
        data: category,
      });
    }
  );

  deleteOneCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await categoryService.deleteOne(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}

const categoryController = new CategoryController();
export default categoryController;
