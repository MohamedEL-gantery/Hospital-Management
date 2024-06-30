import express from 'express';
import doctorClinicPhotoController from './doctorClinicPhoto.controller';
import { uploadSingle } from '../../utils/multer';
import { protect } from './../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    uploadSingle,
    restrictTo(Roles.doctor),
    doctorClinicPhotoController.createDoctorClinicPhoto
  );

router.route('/all').get(doctorClinicPhotoController.getAllDoctorsClinicPhoto);

router
  .route('/me')
  .get(
    restrictTo(Roles.doctor),
    doctorClinicPhotoController.getAllDoctorClinicPhoto
  );

router.route('/:id').get(doctorClinicPhotoController.getOneDoctorClinicPhoto);

router.use(restrictTo(Roles.doctor));

router
  .route('/:id')
  .patch(uploadSingle, doctorClinicPhotoController.updateOneDoctorClinicPhoto)
  .delete(doctorClinicPhotoController.deleteOneDoctorClinicPhoto);

export default router;
