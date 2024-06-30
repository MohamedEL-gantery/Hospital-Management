import{IsNumber,IsString,Max,Min}from 'class-validator'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user';
import { Doctor } from './doctor';

@Entity({ name: 'Review' })
@Unique(['doctor', 'user'])
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  @IsString()
  review!: string;

  @Column('int', { nullable: false })
  @Min(1)
  @Max(5)
  @IsNumber()
  rating!: number;

  @ManyToOne(() => User, (review) => review.userReview, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @ManyToOne(() => Doctor, (review) => review.review, {
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
