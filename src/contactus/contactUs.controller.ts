import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import contactUsService, { ContactUsService } from './contactUs.service';

class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  public createContactUs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, phone, message } = req.body;
      const newMessage = await this.contactUsService.create(
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

  public getAll = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.contactUsService.findAll();

      res.status(200).json({
        status: 'success',
        result: data.length,
        data,
      });
    }
  );
}

const contactUsController = new ContactUsController(contactUsService);
export default contactUsController;
