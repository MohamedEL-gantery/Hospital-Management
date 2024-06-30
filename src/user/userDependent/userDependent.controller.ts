import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../../interfaces/customRequest';
import userDependentService from './userDependent.service';

class UserDependentController {
  createDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.ownerId) req.body.ownerId = (req as CustomRequest).user.id;
      const { ownerId, relationship, userId } = req.body;

      const data = await userDependentService.create(
        ownerId,
        relationship,
        userId
      );

      res.status(201).json({
        status: 'success',
        data: data,
      });
    }
  );

  getAllDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userDependentService.find(
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  getOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userDependentService.findOne(
        req.params.id,
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  updateOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userDependentService.update(
        req.params.id,
        (req as CustomRequest).user.id,
        req.body.relationship
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  deleteOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userDependentService.delete(
        req.params.id,
        (req as CustomRequest).user.id
      );

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
}

const userDependentController = new UserDependentController();
export default userDependentController;
