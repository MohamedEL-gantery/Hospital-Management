import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Entity,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user';
import { Doctor } from './doctor';

@Entity({ name: 'UserWishlist' })
@Unique(['doctor', 'user'])
export class UserWishlist extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.wishlist, {
    cascade: true,
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @ManyToOne(() => Doctor, (doctor) => doctor.userWishlist, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor', referencedColumnName: 'id' })
  doctor!: Doctor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
