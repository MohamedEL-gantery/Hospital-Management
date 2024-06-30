import express from 'express';
import { contactUsValidation } from './contactUs.validation';
import contactUsController from './contactUs.controller';

const router = express.Router();

router.post('/', contactUsValidation, contactUsController.createContactUs);

router.get('/', contactUsController.getAll);

export default router;
