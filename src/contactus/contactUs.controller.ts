import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import contactUsService from './contactUs.service';

class ContactUsController {
  createContactUs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, phone, message } = req.body;
      const newMessage = await contactUsService.create(
        name,
        email,
        phone,
        message
      );
      res.status(201).json({
        status: 'success',
        data: newMessage,
      });
    }
  );

  getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await contactUsService.findAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );
}

const contactUsController = new ContactUsController();
export default contactUsController;
