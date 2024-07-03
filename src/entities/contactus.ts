import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsString, IsMobilePhone } from 'class-validator';

@Entity({ name: 'ContactUs' })
export class ContactUs extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @Column('varchar', { nullable: false })
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @Column('varchar', { nullable: false })
  @IsMobilePhone('ar-EG', {}, { message: 'Enter a valid phone number' })
  phone!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Message must be a string' })
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
