import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import AppError from './appError';

const Filestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../upload/images'));
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}-${Date.now()}.jpeg`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      const err: any = new AppError(
        'Not an image please upload only image',
        400
      );
      cb(err, false);
    }
  } else {
    return new AppError('No file uploaded', 400);
  }
};

export const uploadSingle = multer({
  storage: Filestorage,
  fileFilter: fileFilter,
}).single('photo');
