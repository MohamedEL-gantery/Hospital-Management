import { MigrationInterface, QueryRunner } from "typeorm";

export class Hospital1719766323186 implements MigrationInterface {
    name = 'Hospital1719766323186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."UserDependent_relationship_enum" AS ENUM('son', 'daughter', 'father', 'mother', 'brother', 'sister', 'wife')`);
        await queryRunner.query(`CREATE TABLE "UserDependent" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "relationship" "public"."UserDependent_relationship_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "owner" uuid NOT NULL, "user" uuid NOT NULL, CONSTRAINT "PK_df25a08b9f20fc569ba229d8c70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "photo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, "category" uuid NOT NULL, CONSTRAINT "PK_17b41207a933e2060f824e073fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Category_name_enum" AS ENUM('orthopedic', 'laboratory', 'neurology', 'cardiology', 'mriScans', 'primaryCheckup', 'testing', 'dentist')`);
        await queryRunner.query(`CREATE TABLE "Category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."Category_name_enum" NOT NULL, "photo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0ac420e8701e781dbf1231dc230" UNIQUE ("name"), CONSTRAINT "PK_c2727780c5b9b0c564c29a4977c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "DoctorExperience" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospitalName" character varying NOT NULL, "from" date NOT NULL, "to" date NOT NULL, "designation" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, CONSTRAINT "PK_f9648d6d91d14dca8bb638cd3c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "DoctorEducation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "degree" character varying NOT NULL, "college" character varying NOT NULL, "yearOfCompletion" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, CONSTRAINT "PK_2cccf3be93e31ef6db932312475" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "DoctorClinicPhoto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "photo" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, CONSTRAINT "PK_1e6089a844645ffe91b3e0890b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "DoctorAwards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "awards" character varying NOT NULL, "year" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, CONSTRAINT "PK_c63f12eaaace53e0750fc42465f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Calender_day_enum" AS ENUM('saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')`);
        await queryRunner.query(`CREATE TABLE "Calender" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" "public"."Calender_day_enum" NOT NULL, "dateOfStart" TIME NOT NULL, "dateOfEnd" TIME NOT NULL, "date" date NOT NULL, "duration" TIME NOT NULL, "price" integer NOT NULL, "paid" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "doctor" uuid NOT NULL, CONSTRAINT "PK_0e796236b3f7c88e5c3b7eeef07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Doctor_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TYPE "public"."Doctor_role_enum" AS ENUM('user', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."Doctor_price_enum" AS ENUM('free', 'per hour')`);
        await queryRunner.query(`CREATE TABLE "Doctor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "photo" character varying, "country" character varying, "city" character varying, "address" character varying, "birthDate" date, "aboutMe" character varying, "gender" "public"."Doctor_gender_enum", "role" "public"."Doctor_role_enum" NOT NULL DEFAULT 'doctor', "price" "public"."Doctor_price_enum", "clinicName" character varying, "clinicAddress" character varying, "ratingsAverage" numeric(2,1) NOT NULL DEFAULT '0', "ratingsQuantity" integer NOT NULL DEFAULT '0', "googleId" character varying, "countPassword" integer NOT NULL DEFAULT '0', "facebookUrl" character varying, "twitterUrl" character varying, "instagramUrl" character varying, "youtubeUrl" character varying, "linkedinUrl" character varying, "passwordChangedAt" TIMESTAMP, "passwordResetExpires" TIMESTAMP, "passwordResetCode" character varying, "passwordResetVerified" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "category" uuid, CONSTRAINT "UQ_db44bce3957cc3ee0633ef6fb28" UNIQUE ("email"), CONSTRAINT "UQ_92bef8fc3a471e6ebfb0ac17817" UNIQUE ("phoneNumber"), CONSTRAINT "PK_e51d7afee336c51f147089232fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_660a9fdf19bf857d268b7a91e5" ON "Doctor" ("name") `);
        await queryRunner.query(`CREATE TABLE "Review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "review" character varying NOT NULL, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user" uuid NOT NULL, "doctor" uuid NOT NULL, CONSTRAINT "UQ_58cdebbc92531d5bfe2e114a34b" UNIQUE ("doctor", "user"), CONSTRAINT "PK_4af5ddfa8a65e5571d851e4b752" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doctor" character varying NOT NULL, "cartPrice" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "calender" uuid NOT NULL, "user" uuid NOT NULL, CONSTRAINT "REL_ddfc021ed4b1a225c08dbed124" UNIQUE ("calender"), CONSTRAINT "PK_012c8ac0dc98012aed2f7766e01" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."User_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TYPE "public"."User_blood_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')`);
        await queryRunner.query(`CREATE TYPE "public"."User_role_enum" AS ENUM('user', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "phoneNumber" character varying, "ssn" integer, "photo" character varying, "country" character varying, "city" character varying, "address" character varying, "birthDate" date, "age" integer, "gender" "public"."User_gender_enum", "blood" "public"."User_blood_enum", "role" "public"."User_role_enum" NOT NULL DEFAULT 'user', "googleId" character varying, "countPassword" integer NOT NULL DEFAULT '0', "passwordChangedAt" TIMESTAMP, "passwordResetExpires" TIMESTAMP, "passwordResetCode" character varying, "passwordResetVerified" boolean, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "UQ_a3a6ca48a99127554da5314f645" UNIQUE ("phoneNumber"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_99f220333df04d5f74f6db26c0" ON "User" ("name") `);
        await queryRunner.query(`CREATE TABLE "UserWishlist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user" uuid NOT NULL, "doctor" uuid NOT NULL, CONSTRAINT "UQ_aa728247c8cec5a30d9a9b63edd" UNIQUE ("doctor", "user"), CONSTRAINT "PK_248ac6d4b0ee8613c158696362a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ContactUs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9fc9543689b5c4820416500ff9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doctorName" character varying NOT NULL, "bookingDay" character varying NOT NULL, "dateOfStart" TIME NOT NULL, "dateOfEnd" TIME NOT NULL, "duration" TIME NOT NULL, "dateOfBooking" date NOT NULL, "totalPriceOfBooking" integer NOT NULL, "isConfirmed" boolean NOT NULL, "PaymentMethod" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user" uuid NOT NULL, "doctor" uuid NOT NULL, CONSTRAINT "REL_b56d3f9cba005fed92bbf613e8" UNIQUE ("user"), CONSTRAINT "REL_74cc5437ecd738d6095add4011" UNIQUE ("doctor"), CONSTRAINT "PK_d448e3d9fb1fb94ebd66eac73a2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "UserDependent" ADD CONSTRAINT "FK_8c944d8eac9d2a0c56238dfa48b" FOREIGN KEY ("owner") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserDependent" ADD CONSTRAINT "FK_fb6f3e8b10b1256ea46e93ee2bc" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Blog" ADD CONSTRAINT "FK_8dc1552c4405d8acd48bc3c9586" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Blog" ADD CONSTRAINT "FK_e5bdf47190ff155fc14520b654d" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DoctorExperience" ADD CONSTRAINT "FK_248bfac65f5b787f71dd655fe44" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DoctorEducation" ADD CONSTRAINT "FK_e840e1aa468773361a188318885" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DoctorClinicPhoto" ADD CONSTRAINT "FK_1b61e588878172ee0ec4b99aa9a" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "DoctorAwards" ADD CONSTRAINT "FK_734d0274cf8515bfa67e8373c29" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Calender" ADD CONSTRAINT "FK_0d56684529a924edf7d073fdaa9" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Doctor" ADD CONSTRAINT "FK_101fec21b8083e1cdb39eb1a10f" FOREIGN KEY ("category") REFERENCES "Category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Review" ADD CONSTRAINT "FK_240b6752d59f7d241cd4393691c" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Review" ADD CONSTRAINT "FK_e71522d693763653c0600362b8b" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Cart" ADD CONSTRAINT "FK_ddfc021ed4b1a225c08dbed1242" FOREIGN KEY ("calender") REFERENCES "Calender"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Cart" ADD CONSTRAINT "FK_998fc1ad71c6abb47c8263c7a00" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserWishlist" ADD CONSTRAINT "FK_b6b606f112b61f1979510e7f53e" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "UserWishlist" ADD CONSTRAINT "FK_41fae5252838523d2f15dec51c7" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Booking" ADD CONSTRAINT "FK_b56d3f9cba005fed92bbf613e8e" FOREIGN KEY ("user") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Booking" ADD CONSTRAINT "FK_74cc5437ecd738d6095add40115" FOREIGN KEY ("doctor") REFERENCES "Doctor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Booking" DROP CONSTRAINT "FK_74cc5437ecd738d6095add40115"`);
        await queryRunner.query(`ALTER TABLE "Booking" DROP CONSTRAINT "FK_b56d3f9cba005fed92bbf613e8e"`);
        await queryRunner.query(`ALTER TABLE "UserWishlist" DROP CONSTRAINT "FK_41fae5252838523d2f15dec51c7"`);
        await queryRunner.query(`ALTER TABLE "UserWishlist" DROP CONSTRAINT "FK_b6b606f112b61f1979510e7f53e"`);
        await queryRunner.query(`ALTER TABLE "Cart" DROP CONSTRAINT "FK_998fc1ad71c6abb47c8263c7a00"`);
        await queryRunner.query(`ALTER TABLE "Cart" DROP CONSTRAINT "FK_ddfc021ed4b1a225c08dbed1242"`);
        await queryRunner.query(`ALTER TABLE "Review" DROP CONSTRAINT "FK_e71522d693763653c0600362b8b"`);
        await queryRunner.query(`ALTER TABLE "Review" DROP CONSTRAINT "FK_240b6752d59f7d241cd4393691c"`);
        await queryRunner.query(`ALTER TABLE "Doctor" DROP CONSTRAINT "FK_101fec21b8083e1cdb39eb1a10f"`);
        await queryRunner.query(`ALTER TABLE "Calender" DROP CONSTRAINT "FK_0d56684529a924edf7d073fdaa9"`);
        await queryRunner.query(`ALTER TABLE "DoctorAwards" DROP CONSTRAINT "FK_734d0274cf8515bfa67e8373c29"`);
        await queryRunner.query(`ALTER TABLE "DoctorClinicPhoto" DROP CONSTRAINT "FK_1b61e588878172ee0ec4b99aa9a"`);
        await queryRunner.query(`ALTER TABLE "DoctorEducation" DROP CONSTRAINT "FK_e840e1aa468773361a188318885"`);
        await queryRunner.query(`ALTER TABLE "DoctorExperience" DROP CONSTRAINT "FK_248bfac65f5b787f71dd655fe44"`);
        await queryRunner.query(`ALTER TABLE "Blog" DROP CONSTRAINT "FK_e5bdf47190ff155fc14520b654d"`);
        await queryRunner.query(`ALTER TABLE "Blog" DROP CONSTRAINT "FK_8dc1552c4405d8acd48bc3c9586"`);
        await queryRunner.query(`ALTER TABLE "UserDependent" DROP CONSTRAINT "FK_fb6f3e8b10b1256ea46e93ee2bc"`);
        await queryRunner.query(`ALTER TABLE "UserDependent" DROP CONSTRAINT "FK_8c944d8eac9d2a0c56238dfa48b"`);
        await queryRunner.query(`DROP TABLE "Booking"`);
        await queryRunner.query(`DROP TABLE "ContactUs"`);
        await queryRunner.query(`DROP TABLE "UserWishlist"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_99f220333df04d5f74f6db26c0"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TYPE "public"."User_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."User_blood_enum"`);
        await queryRunner.query(`DROP TYPE "public"."User_gender_enum"`);
        await queryRunner.query(`DROP TABLE "Cart"`);
        await queryRunner.query(`DROP TABLE "Review"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_660a9fdf19bf857d268b7a91e5"`);
        await queryRunner.query(`DROP TABLE "Doctor"`);
        await queryRunner.query(`DROP TYPE "public"."Doctor_price_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Doctor_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Doctor_gender_enum"`);
        await queryRunner.query(`DROP TABLE "Calender"`);
        await queryRunner.query(`DROP TYPE "public"."Calender_day_enum"`);
        await queryRunner.query(`DROP TABLE "DoctorAwards"`);
        await queryRunner.query(`DROP TABLE "DoctorClinicPhoto"`);
        await queryRunner.query(`DROP TABLE "DoctorEducation"`);
        await queryRunner.query(`DROP TABLE "DoctorExperience"`);
        await queryRunner.query(`DROP TABLE "Category"`);
        await queryRunner.query(`DROP TYPE "public"."Category_name_enum"`);
        await queryRunner.query(`DROP TABLE "Blog"`);
        await queryRunner.query(`DROP TABLE "UserDependent"`);
        await queryRunner.query(`DROP TYPE "public"."UserDependent_relationship_enum"`);
    }

}
