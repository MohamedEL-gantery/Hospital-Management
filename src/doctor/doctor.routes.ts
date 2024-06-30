import express from 'express';
import doctorController from './doctor.controller';
import { doctorValidation, searchValidation } from './doctor.validation';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { protect } from '../middlewares/protect.middleware';
import { Roles } from '../enum/roles';
import { uploadSingle } from '../utils/multer';

const router = express.Router();

router.route('/top').get(doctorController.topFiveDoctor);

router.use(protect);

router.route('/').get(doctorController.getAllDoctor);

router
  .route('/me')
  .get(
    restrictTo(Roles.doctor),
    doctorController.getMe,
    doctorController.getOneDoctor
  );

router
  .route('/edit')
  .patch(
    restrictTo(Roles.doctor),
    uploadSingle,
    doctorController.getMe,
    doctorValidation,
    doctorController.updateOneDoctor
  );

router
  .route('/deleteMe')
  .delete(
    restrictTo(Roles.doctor),
    doctorController.getMe,
    doctorController.deleteOneDoctor
  );

router.route('/search').post(searchValidation, doctorController.searchByName);

router
  .route('/:id')
  .get(doctorController.getOneDoctor)
  .patch(restrictTo(Roles.admin), doctorController.updateOneDoctor);

export default router;
