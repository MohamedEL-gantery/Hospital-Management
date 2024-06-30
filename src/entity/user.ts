import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsString,
  IsStrongPassword,
  Max,
  Min,
} from 'class-validator';
import crypto from 'crypto';

import { Blood } from '../enum/blood';
import { Gender } from '../enum/gender';
import { Roles } from '../enum/roles';
import { UserWishlist } from './userWishlist';
import { UserDependent } from './userDependent';
import { Review } from './review';
import { Cart } from './cart';

@Entity({ name: 'User' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { unique: true, nullable: false })
  @IsEmail({}, { message: 'Enter a valid email' })
  email!: string;

  @Column('varchar', { nullable: false })
  @Index()
  @IsString({ message: 'Enter a valid name' })
  @Min(3)
  @Max(30)
  name!: string;

  @Column('varchar', { nullable: false })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @Column('varchar', { unique: true, nullable: true })
  @IsMobilePhone('ar-EG', {}, { message: 'Enter a valid phone number' })
  phoneNumber!: string;

  @Column('int', { nullable: true })
  @Min(14)
  @Max(14)
  ssn!: number;

  @Column('varchar', { nullable: true })
  photo!: string;

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter a valid address' })
  country!: string;

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter a valid city' })
  city!: string;

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter a valid address' })
  address!: string;

  @Column('date', { nullable: true })
  @IsDate({ message: 'Enter a valid date' })
  birthDate!: Date;

  @Column('int', { nullable: true })
  @IsNumber()
  age!: number;

  @Column('enum', { enum: Gender, nullable: true })
  @IsEnum(Gender, { message: 'Gender must be Male,Female' })
  gender!: Gender;

  @Column('enum', { enum: Blood, nullable: true })
  @IsEnum(Blood, { message: 'Blood must be A+,A-,B+,B-,O+,O-,AB+,AB-' })
  blood!: Blood;

  @Column('enum', { enum: Roles, default: Roles.user })
  @IsEnum(Roles)
  role!: Roles;

  @Column('varchar', { nullable: true })
  @IsString()
  googleId!: string;

  @Column('int', { default: 0 })
  @IsNumber()
  countPassword!: number;

  @Column('timestamp', { nullable: true })
  @IsDate()
  passwordChangedAt!: Date;

  @Column('timestamp', { nullable: true })
  @IsDate()
  passwordResetExpires!: Date | null;

  @Column('varchar', { nullable: true })
  @IsString()
  passwordResetCode!: string | null;

  @Column('boolean', { nullable: true })
  @IsBoolean()
  passwordResetVerified!: boolean | null;

  @OneToMany(() => UserWishlist, (wishlist) => wishlist.user)
  wishlist!: UserWishlist;

  @OneToMany(() => UserDependent, (userDependent) => userDependent.owner)
  userDependent!: UserDependent;

  @OneToMany(() => UserDependent, (userDependent) => userDependent.user)
  membersOfUserDependent!: UserDependent[];

  @OneToMany(() => Review, (userReview) => userReview.user)
  userReview!: Review[];

  @OneToMany(() => Cart, (userCart) => userCart.user)
  userCart!: Cart;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  changedPasswordAt(JWtTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const value: any = this.passwordChangedAt.getTime() / 1000;
      const changedTimestamp = parseInt(value, 10);
      return JWtTimestamp < changedTimestamp;
    }

    return false;
  }

  generateVerificationCode(): string {
    const restCode = Math.floor(1000 + Math.random() * 90000).toString();

    this.passwordResetCode = crypto
      .createHash('sha256')
      .update(restCode)
      .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    this.passwordResetVerified = false;

    return restCode;
  }
}
