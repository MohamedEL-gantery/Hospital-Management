import express from 'express';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { protect } from '../middlewares/protect.middleware';
import categoryController from './category.controller';
import {
  categoryUpdateValidation,
  categoryValidation,
} from './category.validation';
import { Roles } from '../enum/roles';
import { uploadSingle } from '../utils/multer';

const router = express.Router();

router.route('/').get(categoryController.getAllCategory);

router.route('/:id').get(categoryController.getOneCategory);

router.use(protect, restrictTo(Roles.admin));

router
  .route('/')
  .post(uploadSingle, categoryValidation, categoryController.createCategory);

router
  .route('/:id')
  .patch(
    uploadSingle,
    categoryUpdateValidation,
    categoryController.updateOneCategory
  )
  .delete(categoryController.deleteOneCategory);

export default router;
