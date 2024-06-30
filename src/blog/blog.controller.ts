import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import blogService from './blog.service';
import CustomRequest from './../interfaces/customRequest';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';

class BlogController {
  createBlog = asyncHandler(
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

      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, category, text } = req.body;
      const blog = await blogService.create(doctor, text, photo, category);

      res.status(201).json({
        status: 'success',
        data: blog,
      });
    }
  );

  getAllBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const blogs = await blogService.getAll();

      res.status(200).json({
        status: 'success',
        result: blogs.length,
        data: blogs,
      });
    }
  );

  getOneBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const blog = await blogService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: blog,
      });
    }
  );
  updateOneBlog = asyncHandler(
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

      const { text, category } = req.body;

      const blog = await blogService.updateOne(
        req.params.id,
        (req as CustomRequest).doctor.id,
        text,
        photo,
        category
      );

      res.status(200).json({
        status: 'success',
        data: blog,
      });
    }
  );

  deleteOneBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await blogService.deleteOne(
        req.params.id,
        (req as CustomRequest).doctor.id
      );

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}

const blogController = new BlogController();
export default blogController;
