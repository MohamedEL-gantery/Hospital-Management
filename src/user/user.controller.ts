import path from 'path';
import fs from 'fs';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import userService, { UserService } from './user.service';
import CustomRequest from './../interfaces/customRequest';
import { cloudinaryUploadSingleImag } from '../utils/cloudinary';

class UserController {
  constructor(private readonly userService: UserService) {}

  public getMe = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = (req as CustomRequest).user.id;
    next();
  };

  public getAllUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await this.userService.getAll();

      res.status(200).json({
        status: 'success',
        result: users.length,
        data: users,
      });
    }
  );

  public getOneUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await this.userService.getOne(req.params.id);

      res.status(200).json({
        status: 'success',
        data: user,
      });
    }
  );

  public updateOneUser = asyncHandler(
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

      const {
        name,
        email,
        phoneNumber,
        ssn,
        country,
        city,
        address,
        birthDate,
        age,
        blood,
        gender,
      } = req.body;

      const user = await this.userService.updateOne(
        req.params.id,
        name,
        email,
        phoneNumber,
        ssn,
        photo,
        country,
        city,
        address,
        birthDate,
        age,
        blood,
        gender
      );

      res.status(200).json({
        status: 'success',
        data: user,
      });
    }
  );

  public deleteOneUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.userService.deleteOne((req as CustomRequest).user.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );

  public searchByName = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.body;

      const users = await this.userService.search(name);

      res.status(200).json({
        status: 'success',
        data: users,
      });
    }
  );
}

const userController = new UserController(userService);
export default userController;
