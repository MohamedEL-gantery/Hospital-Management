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
import { IsDate, IsString } from 'class-validator';
import { Doctor } from './doctor';

@Entity({ name: 'DoctorEducation' })
export class DoctorEducation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter a valid value' })
  degree!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter a valid value' })
  college!: string;

  @Column('date', { nullable: false })
  @IsDate()
  yearOfCompletion!: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.educations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'doctor', referencedColumnName: 'id' }])
  doctor!: Doctor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
