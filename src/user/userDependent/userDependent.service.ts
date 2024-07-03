import 'express-async-errors';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../db';
import { UserDependent } from '../../entities/userDependent';
import { User } from '../../entities/user';
import AppError from '../../utils/appError';
import { Relationship } from '../../enum/relationship';
import { Roles } from '../../enum/roles';

export class UserDependentService {
  private userRepository;
  private userDependentRepository;
  constructor(private dataSource: DataSource) {
    this.userRepository = this.dataSource.getRepository(User);
    this.userDependentRepository = this.dataSource.getRepository(UserDependent);
  }

  public create = async (owner: any, relationship: Relationship, user: any) => {
    const dependent = await this.userDependentRepository.find({
      where: { owner: { id: owner } },
      relations: ['user'],
    });

    if (!dependent) {
      const newDependent = this.userDependentRepository.create({
        owner,
        relationship,
        user: { id: user },
      });

      if (owner === user) {
        throw new AppError(`You can't add you in your dependent`, 400);
      }

      const userFound = await this.userRepository.findOne({
        where: { id: user },
      });

      if (!userFound) {
        throw new AppError('User not found', 404);
      }
      await newDependent.save();

      return newDependent;
    }

    const userExist = dependent.map((el) => el.user.id);

    if (userExist.includes(user)) {
      throw new AppError('User already exist', 404);
    }

    const newDependent = this.userDependentRepository.create({
      owner,
      relationship,
      user: { id: user },
    });

    if (owner === user) {
      throw new AppError(`You can't add you in your dependent`, 400);
    }

    const userFound = await this.userRepository.findOne({
      where: { id: user },
    });

    if (!userFound) {
      throw new AppError('User not found', 404);
    }
    await newDependent.save();

    return newDependent;
  };

  public find = async (owner: any) => {
    const allData = await this.userDependentRepository.find({
      relations: ['user', 'owner'],
    });

    const data = allData.filter((el) => el.owner.id === owner);

    return data;
  };

  public findOne = async (id: any, owner: any) => {
    const data = await this.userDependentRepository.findOne({
      where: { id },
      relations: ['user', 'owner'],
    });

    if (!data) {
      throw new AppError('No data found', 404);
    }

    if (data.owner.id !== owner && data.owner.role !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    return data;
  };

  public update = async (id: any, owner: any, relationship: Relationship) => {
    const data = await this.userDependentRepository.findOne({
      where: { id },
      relations: ['user', 'owner'],
    });

    if (!data) {
      throw new AppError('No data found', 404);
    }

    if (data.owner.id !== owner && data.owner.role !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    data.relationship = relationship || data.relationship;

    await data.save();

    return data;
  };

  public delete = async (id: any, owner: any) => {
    const data = await this.userDependentRepository.findOne({
      where: { id },
      relations: ['user', 'owner'],
    });

    if (!data) {
      throw new AppError('No data found', 404);
    }

    if (data.owner.id !== owner && data.owner.role !== Roles.admin) {
      throw new AppError(
        'You do not have permission to perform this action',
        403
      );
    }

    await data.remove();
  };
}

const userDependentService = new UserDependentService(AppDataSource);
export default userDependentService;
