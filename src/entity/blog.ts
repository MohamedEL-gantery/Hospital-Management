import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Doctor } from './doctor';
import { Category } from './category';

@Entity({ name: 'Blog' })
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter valid text' })
  @Transform(({ value }) => value.trim())
  text!: string;

  @Column('varchar', { nullable: false })
  photo!: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.blogs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'doctor', referencedColumnName: 'id' }])
  doctor!: Doctor;

  @ManyToOne(() => Category, (category) => category.blogs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'category', referencedColumnName: 'id' }])
  category!: Category;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
