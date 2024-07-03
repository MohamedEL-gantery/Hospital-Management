import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { ContactUs } from '../entities/contactus';

export class ContactUsService {
  private contactUsRepository;

  constructor(private dataSource: DataSource) {
    this.contactUsRepository = this.dataSource.getRepository(ContactUs);
  }

  public async create(
    name: string,
    email: string,
    phone: string,
    message: string
  ) {
    const newMessage = this.contactUsRepository.create({
      name,
      email,
      phone,
      message,
    });
    await this.contactUsRepository.save(newMessage);
    return newMessage;
  }

  public async findAll() {
    const message = await this.contactUsRepository.find();
    return message;
  }
}

const contactUsService = new ContactUsService(AppDataSource);
export default contactUsService;
