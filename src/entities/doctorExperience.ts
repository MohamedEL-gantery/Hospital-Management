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
import { Transform } from 'class-transformer';
import { Doctor } from './doctor';

@Entity({ name: 'DoctorExperience' })
export class DoctorExperience extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter a valid name' })
  @Transform(({ value }) => value.trim())
  hospitalName!: string;

  @Column('date', { nullable: false })
  @IsDate()
  from!: Date;

  @Column('date', { nullable: false })
  @IsDate()
  to!: Date;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter a valid designation' })
  @Transform(({ value }) => value.trim())
  designation!: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.experiences, {
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
