import express from 'express';
import calenderController from './doctorCalendar.controller';
import { protect } from './../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router.route('/paid').get(restrictTo(Roles.admin),calenderController.getAllDoctorsCalendersPaid);

router.route('/all').get(restrictTo(Roles.admin),calenderController.getAllDoctorsCalenders);

router.route('/doctor/:id').get(calenderController.getAllOneDoctorCalenders);

router.route('/:id').get(calenderController.getOneCalender);

router.use(restrictTo(Roles.doctor));

router.route('/').post( calenderController.createCalender);

router.route('/me/all').get(calenderController.getAllDoctorCalender);

router.route('/me/paid').get(calenderController.getAllDoctorCalendersPaid)

router
  .route('/:id')
  .patch(calenderController.updateOneCalender)
  .delete(calenderController.deleteOneCalender);

export default router;
