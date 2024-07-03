import 'express-async-errors';
import { AppDataSource } from '..//db';
import { Category } from '../entities/category';
import AppError from '../utils/appError';
import { Type } from '../enum/category';
import { DataSource } from 'typeorm';

export class CategoryService {
  private categoryRepository;
  constructor(private dataSource: DataSource) {
    this.categoryRepository = this.dataSource.getRepository(Category);
  }

  public create = async (name: Type, photo: any) => {
    const newCategory = this.categoryRepository.create({ name, photo });

    const nameExist = await this.categoryRepository.findOne({
      where: { name },
    });

    if (nameExist) {
      throw new AppError('Category already exist', 400);
    }

    await newCategory.save();

    return newCategory;
  };

  public find = async () => {
    const categories = await this.categoryRepository.find({
      relations: ['doctors', 'blogs'],
    });
    return categories;
  };

  public getOne = async (id: any) => {
    const category = await this.categoryRepository.find({
      where: { id },
      relations: ['doctors', 'blogs'],
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  };

  public updateOne = async (id: any, name?: Type, photo?: any) => {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    category.name = name || category.name;
    category.photo = photo || category.photo;

    await category.save();

    return category;
  };

  public deleteOne = async (id: any) => {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await category.remove();
  };
}

const categoryService = new CategoryService(AppDataSource);
export default categoryService;
