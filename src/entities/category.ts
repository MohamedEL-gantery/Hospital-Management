import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import { Type } from '../enum/category';
import { Doctor } from './doctor';
import { Blog } from './blog';

@Entity({ name: 'Category' })
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('enum', { enum: Type, unique: true, nullable: false })
  @IsEnum(Type, { message: 'Enter a valid category name' })
  name!: Type;

  @Column('varchar', { nullable: false })
  photo!: string;

  @OneToMany(() => Doctor, (doctor) => doctor.category, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'doctors', referencedColumnName: 'id' }])
  doctors!: Doctor[];

  @OneToMany(() => Blog, (blog) => blog.category, { onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'blogs', referencedColumnName: 'id' }])
  blogs!: Blog[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
