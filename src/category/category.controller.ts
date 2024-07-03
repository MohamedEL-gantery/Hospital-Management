import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';
import categoryService, { CategoryService } from './category.service';

class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  public createCategory = asyncHandler(
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
      const newCategory = await this.categoryService.create(name, photo);

      res.status(201).json({
        status: 'success',
        data: newCategory,
      });
    }
  );

  public getAllCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const categories = await this.categoryService.find();

      res.status(200).json({
        status: 'success',
        result: categories.length,
        data: categories,
      });
    }
  );

  public getOneCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const category = await this.categoryService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: category,
      });
    }
  );

  public updateOneCategory = asyncHandler(
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

      const category = await this.categoryService.updateOne(
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

  public deleteOneCategory = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.categoryService.deleteOne(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}

const categoryController = new CategoryController(categoryService);
export default categoryController;
