import express from 'express';
import doctorExperienceController from './doctorExperience.controller';
import {
  experienceValidation,
  updateExperienceValidation,
} from './doctorExperience.validation';
import { protect } from './../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo(Roles.doctor),
    experienceValidation,
    doctorExperienceController.createDoctorExperience
  );

router.route('/all').get(doctorExperienceController.getAllDoctorsExperience);

router
  .route('/me')
  .get(
    restrictTo(Roles.doctor),
    doctorExperienceController.getAllDoctorExperience
  );

router.route('/:id').get(doctorExperienceController.getOneDoctorExperience);

router.use(restrictTo(Roles.doctor));

router
  .route('/:id')
  .patch(
    updateExperienceValidation,
    doctorExperienceController.updateOneDoctorExperience
  )
  .delete(doctorExperienceController.deleteOneDoctorExperience);

export default router;
