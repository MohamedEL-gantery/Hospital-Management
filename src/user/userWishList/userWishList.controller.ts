import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../../interfaces/customRequest';
import userWishlistService from './userWishList.service';

class UserWishListController {
  createWishList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;

      const { doctor, user } = req.body;

      const newWishlist = await userWishlistService.crete(user, doctor);

      res.status(201).json({
        status: 'success',
        data: newWishlist,
      });
    }
  );

  getAllWishList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await userWishlistService.getAll(
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  deleteOneWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await userWishlistService.deleteOne(
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

const userWishListController = new UserWishListController();

export default userWishListController;
