import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../../interfaces/customRequest';
import userDependentService, {
  UserDependentService,
} from './userDependent.service';

class UserDependentController {
  constructor(private readonly userDependentService: UserDependentService) {}

  public createDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.ownerId) req.body.ownerId = (req as CustomRequest).user.id;
      const { ownerId, relationship, userId } = req.body;

      const data = await this.userDependentService.create(
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

  public getAllDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userDependentService.find(
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  public getOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userDependentService.findOne(
        req.params.id,
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  );

  public updateOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userDependentService.update(
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

  public deleteOneDependent = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.userDependentService.delete(
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

const userDependentController = new UserDependentController(
  userDependentService
);
export default userDependentController;
