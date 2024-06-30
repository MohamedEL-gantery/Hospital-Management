import express from 'express';
import userDependentController from './userDependent.controller';
import {
  addDependentValidation,
  updateDependentValidation,
} from './userDependent.validation';
import { protect } from '../../middlewares/protect.middleware';
import { restrictTo } from './../../middlewares/restrictTo.middleware';
import { Roles } from '../../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo(Roles.user),
    addDependentValidation,
    userDependentController.createDependent
  );

router.route('/all').get(userDependentController.getAllDependent);

router.use(restrictTo(Roles.user, Roles.admin));

router.route('/:id').get(userDependentController.getOneDependent);

router
  .route('/:id')
  .patch(updateDependentValidation, userDependentController.updateOneDependent);

router.route('/:id').delete(userDependentController.deleteOneDependent);
export default router;
