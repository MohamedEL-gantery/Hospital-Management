import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IsBoolean, IsDate, IsEnum, IsNumber } from 'class-validator';
import { IsTime } from '../utils/time';
import { Day } from '../enum/day';
import { Doctor } from './doctor';

@Entity({ name: 'Calender' })
export class Calender extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('enum', { enum: Day, nullable: false })
  @IsEnum(Day, { message: 'Enter a valid day' })
  day!: Day;

  @Column('time without time zone', { nullable: false })
  @IsTime({ message: 'Start time must be in the format HH:mm or HH:mm:ss' })
  dateOfStart!: string;

  @Column('time without time zone', { nullable: false })
  @IsTime({ message: 'End time must be in the format HH:mm or HH:mm:ss' })
  dateOfEnd!: string;

  @Column('date', { nullable: false })
  @IsDate()
  date!: Date;

  @Column('time without time zone', { nullable: false })
  @IsTime({ message: 'duration must be in the format HH:mm or HH:mm:ss' })
  duration!: string;

  @Column('int', { nullable: false })
  @IsNumber()
  price!: number;

  @Column('boolean', { default: false })
  @IsBoolean()
  paid!: boolean;

  @ManyToOne(() => Doctor, (calender) => calender.availableTime, {
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
