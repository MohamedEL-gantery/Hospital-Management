import express from 'express';
import doctorEducationController from './doctorEducation.controller';
import {
  educationValidation,
  updateEducationValidation,
} from './doctorEducation.validation';
import { protect } from './../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo(Roles.doctor),
    educationValidation,
    doctorEducationController.createDoctorEducation
  );

router.route('/all').get(doctorEducationController.getAllDoctorsEducation);

router
  .route('/me')
  .get(
    restrictTo(Roles.doctor),
    doctorEducationController.getAllDoctorEducations
  );

router.route('/:id').get(doctorEducationController.getOneDoctorEducation);

router.use(restrictTo(Roles.doctor));

router
  .route('/:id')
  .patch(
    updateEducationValidation,
    doctorEducationController.updateOneDoctorEducation
  )
  .delete(doctorEducationController.deleteOneDoctorEducation);

export default router;
