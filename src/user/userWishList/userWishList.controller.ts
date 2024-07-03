import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../../interfaces/customRequest';
import userWishlistService, {
  UserWishlistService,
} from './userWishList.service';

class UserWishListController {
  constructor(private readonly userWishlistService: UserWishlistService) {}

  public createWishList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;

      const { doctor, user } = req.body;

      const newWishlist = await this.userWishlistService.create(user, doctor);

      res.status(201).json({
        status: 'success',
        data: newWishlist,
      });
    }
  );

  public getAllWishList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.userWishlistService.getAll(
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  public deleteOneWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.userWishlistService.deleteOne(
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

const userWishListController = new UserWishListController(userWishlistService);

export default userWishListController;
