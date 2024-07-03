import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  OneToMany,
  JoinColumn,
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
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import crypto from 'crypto';

import { Gender } from '../enum/gender';
import { Roles } from '../enum/roles';
import { Pricing } from '../enum/pricing';
import { Category } from './category';
import { Blog } from './blog';
import { DoctorExperience } from './doctorExperience';
import { DoctorEducation } from './doctorEducation';
import { DoctorClinicPhoto } from './doctorClinicPhoto';
import { DoctorAwards } from './doctorAwards';
import { UserWishlist } from './userWishlist';
import { Calender } from './doctorCalender';
import { Review } from './review';

@Entity({ name: 'Doctor' })
export class Doctor extends BaseEntity {
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

  @Column('varchar', { unique: true, nullable: false })
  @IsMobilePhone('ar-EG', {}, { message: 'Enter a valid phone number' })
  phoneNumber!: string;

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

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter valid a text' })
  @Transform(({ value }) => value.trim())
  aboutMe!: string;

  @Column('enum', { enum: Gender, nullable: true })
  @IsEnum(Gender, { message: 'Gender must be Male,Female' })
  gender!: Gender;

  @Column('enum', { enum: Roles, default: Roles.doctor })
  @IsEnum(Roles)
  role!: Roles;

  @Column('enum', { enum: Pricing, nullable: true })
  @IsEnum(Pricing)
  price!: Pricing;

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter a valid clinicName' })
  clinicName!: string;

  @Column('varchar', { nullable: true })
  @IsString({ message: 'Enter a valid clinicAddress' })
  clinicAddress!: string;

  @Column('decimal', { precision: 2, scale: 1, default: 0 })
  @Min(1, { message: 'Rating must be above 1.0' })
  @Max(5, { message: 'Rating must be below 5.0' })
  ratingsAverage!: number;

  @Column('int', { default: 0 })
  ratingsQuantity!: number;

  @Column('varchar', { nullable: true })
  @IsString()
  googleId!: string;

  @Column('int', { default: 0 })
  @IsNumber()
  countPassword!: number;

  @Column('varchar', { nullable: true })
  @IsUrl()
  facebookUrl!: string;

  @Column('varchar', { nullable: true })
  @IsUrl()
  twitterUrl!: string;

  @Column('varchar', { nullable: true })
  @IsUrl()
  instagramUrl!: string;

  @Column('varchar', { nullable: true })
  @IsUrl()
  youtubeUrl!: string;

  @Column('varchar', { nullable: true })
  @IsUrl()
  linkedinUrl!: string;

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

  @ManyToOne(() => Category, (category) => category.doctors)
  @JoinColumn([{ name: 'category', referencedColumnName: 'id' }])
  category!: Category;

  @OneToMany(() => Blog, (blog) => blog.doctor)
  blogs!: Blog[];

  @OneToMany(() => DoctorExperience, (doc) => doc.doctor)
  experiences!: DoctorExperience[];

  @OneToMany(() => DoctorEducation, (doc) => doc.doctor)
  educations!: DoctorEducation[];

  @OneToMany(() => DoctorAwards, (doc) => doc.doctor)
  awards!: DoctorAwards[];

  @OneToMany(() => DoctorClinicPhoto, (doc) => doc.doctor)
  clinicPhotos!: DoctorClinicPhoto[];

  @OneToMany(() => UserWishlist, (wishlist) => wishlist.doctor)
  userWishlist!: UserWishlist[];

  @OneToMany(() => Calender, (doc) => doc.doctor)
  availableTime!: Calender[];

  @OneToMany(() => Review, (doc) => doc.doctor)
  review!: Review[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  roundRatingsAverage() {
    if (this.ratingsAverage) {
      this.ratingsAverage = Math.round(this.ratingsAverage * 10) / 10;
    }
  }

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
