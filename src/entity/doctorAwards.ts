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

@Entity({ name: 'DoctorAwards' })
export class DoctorAwards extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString({ message: 'Enter a valid value' })
  awards!: string;

  @Column('date', { nullable: false })
  @IsDate()
  year!: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.awards, {
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
