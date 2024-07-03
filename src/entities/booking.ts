import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';
import { Doctor } from './doctor';

@Entity({ name: 'Booking' })
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @OneToOne(() => Doctor, { nullable: false })
  @JoinColumn([{ name: 'doctor', referencedColumnName: 'id' }])
  doctor!: Doctor;

  @Column('varchar', { nullable: false })
  doctorName!: string;

  @Column('varchar', { nullable: false })
  bookingDay!: string;

  @Column('time without time zone', { nullable: false })
  dateOfStart!: string;

  @Column('time without time zone', { nullable: false })
  dateOfEnd!: string;

  @Column('time without time zone', { nullable: false })
  duration!: string;

  @Column('date', { nullable: false })
  dateOfBooking!: Date;

  @Column('int', { nullable: false })
  totalPriceOfBooking!: number;

  @Column('boolean')
  isConfirmed!: boolean;

  @Column('varchar')
  PaymentMethod!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
