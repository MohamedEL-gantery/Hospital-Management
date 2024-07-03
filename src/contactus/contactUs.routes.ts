import express from 'express';
import { contactUsValidation } from './contactUs.validation';
import contactUsController from './contactUs.controller';
import { protect } from './../middlewares/protect.middleware';
import { restrictTo } from './../middlewares/restrictTo.middleware';
import { Roles } from '../enum/roles';

const router = express.Router();

router.route('/').post(contactUsValidation, contactUsController.createContactUs);


router.use(protect)

router.route('/').get(restrictTo(Roles.admin),contactUsController.getAll);

export default router;
