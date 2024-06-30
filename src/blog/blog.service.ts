import 'express-async-errors';
import { AppDataSource } from '../db';
import { Category } from '../entity/category';
import { Blog } from '../entity/blog';
import { Doctor } from '../entity/doctor';
import AppError from '../utils/appError';
import { Roles } from '../enum/roles';

const blogRepository = AppDataSource.getRepository(Blog);
const doctorRepository = AppDataSource.getRepository(Doctor);
const categoryRepository = AppDataSource.getRepository(Category);

class BlogService {
  create = async (doctor: any, text: string, photo: any, category: any) => {
    const newBlog = blogRepository.create({
      doctor: { id: doctor },
      category: { id: category },
      text,
      photo,
    });

    const doctorId = await doctorRepository.findOne({ where: { id: doctor } });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    const categoryId = await categoryRepository.findOne({
      where: { id: category },
    });

    if (!categoryId) {
      throw new AppError('category not found', 404);
    }

    await newBlog.save();

    return newBlog;
  };

  getAll = async () => {
    const blogs = await blogRepository.find({
      relations: ['category', 'doctor'],
    });
    return blogs;
  };

  getOne = async (id: any) => {
    const blog = await blogRepository.findOne({
      where: { id },
      relations: ['category', 'doctor'],
    });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    return blog;
  };

  updateOne = async (
    id: any,
    doctor: any,
    text?: string,
    photo?: string,
    category?: any
  ) => {
    const blog = await blogRepository.findOne({
      where: { id },
      relations: ['category', 'doctor'],
    });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    if (blog.doctor.id !== doctor && blog.doctor.id !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    blog.text = text || blog.text;
    blog.photo = photo || blog.photo;
    blog.category = category || blog.category;

    const categoryExist = await categoryRepository.findOne({
      where: { id: category },
    });

    if (!categoryExist) {
      throw new AppError('Category not found', 404);
    }

    await blog.save();

    return blog;
  };

  deleteOne = async (id: any, doctor: any) => {
    const blog = await blogRepository.findOne({
      where: { id },
      relations: ['category', 'doctor'],
    });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    if (blog.doctor.id !== doctor && blog.doctor.id !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    await blog.remove();
  };
}

const blogService = new BlogService();
export default blogService;
