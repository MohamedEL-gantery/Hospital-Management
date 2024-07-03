import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import CustomRequest from './../interfaces/customRequest';
import cartService, { CartService } from './cart.service';
class CartController {
  constructor(private readonly cartService: CartService) {}

  public createCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.user) req.body.user = (req as CustomRequest).user.id;

      const { calendar, user } = req.body;

      const newCart = await this.cartService.create(calendar, user);

      res.status(201).json({
        status: 'success',
        data: newCart,
      });
    }
  );

  public getAllCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.cartService.getAll(
        (req as CustomRequest).user.id
      );

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );

  public deleteOneCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.cartService.deleteOne(
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

const cartController = new CartController(cartService);

export default cartController;
