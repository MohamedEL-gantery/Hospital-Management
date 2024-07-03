import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import blogService, { BlogService } from './blog.service';
import CustomRequest from './../interfaces/customRequest';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';

class BlogController {
  constructor(private readonly blogService: BlogService) {}

  public createBlog = asyncHandler(
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

      if (!req.body.doctor) req.body.doctor = (req as CustomRequest).doctor.id;

      const { doctor, category, text } = req.body;
      const blog = await this.blogService.create(doctor, text, photo, category);

      res.status(201).json({
        status: 'success',
        data: blog,
      });
    }
  );

  public getAllBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const blogs = await this.blogService.getAll();

      res.status(200).json({
        status: 'success',
        result: blogs.length,
        data: blogs,
      });
    }
  );

  public getOneBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const blog = await this.blogService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: blog,
      });
    }
  );

  public updateOneBlog = asyncHandler(
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

      const blog = await this.blogService.updateOne(
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

  public deleteOneBlog = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.blogService.deleteOne(
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

const blogController = new BlogController(blogService);
export default blogController;
