import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Calender } from './doctorCalender';
import { User } from './user';

@Entity({ name: 'Cart' })
export class Cart extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Calender, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'calender', referencedColumnName: 'id' }])
  calender!: Calender;

  @ManyToOne(() => User, (cart) => cart.userCart, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @Column('varchar', { nullable: false })
  doctor!: string;

  @Column('int', { nullable: false })
  cartPrice!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
