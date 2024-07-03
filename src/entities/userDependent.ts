import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user';
import { Relationship } from '../enum/relationship';
import { IsEnum } from 'class-validator';


@Entity({ name: 'UserDependent' })
export class UserDependent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('enum', { enum: Relationship, nullable: false })
  @IsEnum(Relationship, { message: 'Enter a valid relationship' })
  relationship!: Relationship;

  @ManyToOne(() => User, (user) => user.userDependent, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'owner', referencedColumnName: 'id' }])
  owner!: User;

  @ManyToOne(() => User, (user) => user.membersOfUserDependent, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
