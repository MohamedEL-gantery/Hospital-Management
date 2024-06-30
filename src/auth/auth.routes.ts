import express from 'express';
import authController from './auth.controller';
import {
  userValidation,
  doctorValidation,
  loginValidation,
  loginAdminValidation,
  forgetPasswordValidation,
  verifyCodeValidation,
  resetPasswordValidation,
  updatePasswordValidation,
} from './auth.validation';
import { protect } from '../middlewares/protect.middleware';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { Roles } from '../enum/roles';

const router = express.Router();

router.route('/user/signup').post(userValidation, authController.signUpUser);

router
  .route('/doctor/signup')
  .post(doctorValidation, authController.signUpDoctor);

router.route('/user/login').post(loginValidation, authController.loginUser);

router.route('/doctor/login').post(loginValidation, authController.loginDoctor);

router.route('/admin').post(loginAdminValidation, authController.loginAdmin);

router
  .route('/user/forgetpassword')
  .post(forgetPasswordValidation, authController.forgetPasswordUser);

router
  .route('/doctor/forgetpassword')
  .post(forgetPasswordValidation, authController.forgetPasswordDoctor);

router.use(protect);

router
  .route('/user/verify')
  .post(
    verifyCodeValidation,
    restrictTo(Roles.user),
    authController.verifyResetCodeUser
  );

router
  .route('/user/resetPassword')
  .post(
    resetPasswordValidation,
    restrictTo(Roles.user),
    authController.resetPasswordUser
  );

router
  .route('/doctor/verify')
  .post(
    verifyCodeValidation,
    restrictTo(Roles.doctor),
    authController.verifyResetCodeDoctor
  );

router
  .route('/doctor/resetPassword')
  .post(
    resetPasswordValidation,
    restrictTo(Roles.doctor),
    authController.resetPasswordDoctor
  );

router
  .route('/user/updatePassword')
  .patch(
    updatePasswordValidation,
    restrictTo(Roles.user),
    authController.updatePasswordUser
  );

router
  .route('/doctor/updatePassword')
  .patch(
    updatePasswordValidation,
    restrictTo(Roles.doctor),
    authController.updatePasswordDoctor
  );

export default router;
