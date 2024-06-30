import express from 'express';
import doctorAwardsController from './doctorAwards.controller';
import {
  awardsValidation,
  updateAwardsValidation,
} from './doctorAwards.validation';
import { protect } from './../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo(Roles.doctor),
    awardsValidation,
    doctorAwardsController.createDoctorAwards
  );

router.route('/all').get(doctorAwardsController.getAllDoctorsAwards);

router
  .route('/me')
  .get(restrictTo(Roles.doctor), doctorAwardsController.getAllDoctorAwards);

router.route('/:id').get(doctorAwardsController.getOneDoctorAwards);

router.use(restrictTo(Roles.doctor));

router
  .route('/:id')
  .patch(updateAwardsValidation, doctorAwardsController.updateOneDoctorAwards)
  .delete(doctorAwardsController.deleteOneDoctorAwards);

export default router;
