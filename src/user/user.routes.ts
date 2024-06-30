import express from 'express';
import { protect } from '../middlewares/protect.middleware';
import userController from './user.controller';
import { restrictTo } from './../middlewares/restrictTo.middleware';
import { uploadSingle } from '../utils/multer';
import { searchValidation, userValidation } from './user.validation';
import { Roles } from '../enum/roles';

const router = express.Router();

router.use(protect);

router.route('/').get(userController.getAllUser);

router.route('/me').get(userController.getMe, userController.getOneUser);

router.route('/:id').get(userController.getOneUser);

router
  .route('/updateMe')
  .patch(
    userController.getMe,
    restrictTo(Roles.user),
    uploadSingle,
    userValidation,
    userController.updateOneUser
  );

router
  .route('/:id')
  .patch(
    restrictTo(Roles.admin),
    uploadSingle,
    userValidation,
    userController.updateOneUser
  );

router
  .route('/deleteMe')
  .delete(
    userController.getMe,
    restrictTo(Roles.user),
    userController.deleteOneUser
  );

router.route('/search').post(searchValidation, userController.searchByName);

export default router;
