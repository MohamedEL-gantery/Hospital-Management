import { AppDataSource } from '../db';
import { ContactUs } from '../entity/contactus';

const ContactUsRepository = AppDataSource.getRepository(ContactUs);

class ContactUsService {
  async create(name: string, email: string, phone: string, message: string) {
    const newMessage = ContactUsRepository.create({
      name,
      email,
      phone,
      message,
    });
    await ContactUsRepository.save(newMessage);
    return newMessage;
  }

  async findAll() {
    const message = await ContactUsRepository.find();
    return message;
  }
}

const contactUsService = new ContactUsService();
export default contactUsService;
