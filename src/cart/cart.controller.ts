import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../interfaces/customRequest';
import cartService from './cart.service';
class CartController {
  createCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;

      const { calendar, user } = req.body;

      const newCart = await cartService.create(calendar, user);

      res.status(201).json({
        status: 'success',
        data: newCart,
      });
    }
  );

  getAllCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await cartService.getAll((req as CustomRequest).user.id);

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  deleteOneCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await cartService.deleteOne(
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

const cartController = new CartController();

export default cartController;
