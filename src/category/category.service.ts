import 'express-async-errors';
import { AppDataSource } from '..//db';
import { Category } from '../entity/category';
import AppError from '../utils/appError';
import { Type } from '../enum/category';

const categoryRepository = AppDataSource.getRepository(Category);

class CategoryService {
  create = async (name: Type, photo: any) => {
    const newCategory = categoryRepository.create({ name, photo });

    const nameExist = await categoryRepository.findOne({ where: { name } });

    if (nameExist) {
      throw new AppError('Category already exist', 400);
    }

    await newCategory.save();

    return newCategory;
  };

  find = async () => {
    const categories = await categoryRepository.find({
      relations: ['doctors', 'blogs'],
    });
    return categories;
  };

  getOne = async (id: any) => {
    const category = await categoryRepository.find({
      where: { id },
      relations: ['doctors', 'blogs'],
    });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  };

  updateOne = async (id: any, name?: Type, photo?: any) => {
    const category = await categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    category.name = name || category.name;
    category.photo = photo || category.photo;

    await category.save();

    return category;
  };

  deleteOne = async (id: any) => {
    const category = await categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await category.remove();
  };
}

const categoryService = new CategoryService();
export default categoryService;
