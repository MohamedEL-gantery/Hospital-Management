import express from 'express';
import blogController from './blog.controller';
import { restrictTo } from '../middlewares/restrictTo.middleware';
import { protect } from '../middlewares/protect.middleware';
import { blogValidation, updateBlogValidation } from './blog.validation';
import { uploadSingle } from '../utils/multer';
import { Roles } from '../enum/roles';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo(Roles.doctor),
    uploadSingle,
    blogValidation,
    blogController.createBlog
  )
  .get(blogController.getAllBlog);

router
  .route('/:id')
  .get(blogController.getOneBlog)
  .patch(
    uploadSingle,
    restrictTo(Roles.doctor, Roles.admin),
    updateBlogValidation,
    blogController.updateOneBlog
  )
  .delete(restrictTo(Roles.doctor, Roles.admin), blogController.deleteOneBlog);

export default router;
