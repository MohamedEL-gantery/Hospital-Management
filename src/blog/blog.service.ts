import 'express-async-errors';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../db';
import { Category } from '../entities/category';
import { Blog } from '../entities/blog';
import { Doctor } from '../entities/doctor';
import AppError from '../utils/appError';
import { Roles } from '../enum/roles';

export class BlogService {
  private blogRepository;
  private doctorRepository;
  private categoryRepository;
  constructor(private dataSource: DataSource) {
    this.blogRepository = this.dataSource.getRepository(Blog);
    this.doctorRepository = this.dataSource.getRepository(Doctor);
    this.categoryRepository = this.dataSource.getRepository(Category);
  }

  public create = async (
    doctor: any,
    text: string,
    photo: any,
    category: any
  ) => {
    const newBlog = this.blogRepository.create({
      doctor: { id: doctor },
      category: { id: category },
      text,
      photo,
    });

    const doctorId = await this.doctorRepository.findOne({
      where: { id: doctor },
    });

    if (!doctorId) {
      throw new AppError('doctor not found', 404);
    }

    const categoryId = await this.categoryRepository.findOne({
      where: { id: category },
    });

    if (!categoryId) {
      throw new AppError('category not found', 404);
    }

    await newBlog.save();

    return newBlog;
  };

  public getAll = async () => {
    const blogs = await this.blogRepository.find({
      relations: ['category', 'doctor'],
    });
    return blogs;
  };

  public getOne = async (id: any) => {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: ['category', 'doctor'],
    });

    if (!blog) {
      throw new AppError('Blog not found', 404);
    }

    return blog;
  };

  public updateOne = async (
    id: any,
    doctor: any,
    text?: string,
    photo?: string,
    category?: any
  ) => {
    const blog = await this.blogRepository.findOne({
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

    const categoryExist = await this.categoryRepository.findOne({
      where: { id: category },
    });

    if (!categoryExist) {
      throw new AppError('Category not found', 404);
    }

    await blog.save();

    return blog;
  };

  public deleteOne = async (id: any, doctor: any) => {
    const blog = await this.blogRepository.findOne({
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

const blogService = new BlogService(AppDataSource);
export default blogService;
