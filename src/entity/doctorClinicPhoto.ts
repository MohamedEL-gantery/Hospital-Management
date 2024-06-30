import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,UpdateDateColumn,BaseEntity,JoinColumn,ManyToOne}from 'typeorm'
import { Doctor } from './doctor';

@Entity({ name: 'DoctorClinicPhoto' })
export class DoctorClinicPhoto extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { nullable: false })
  photo!: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.clinicPhotos, {
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
