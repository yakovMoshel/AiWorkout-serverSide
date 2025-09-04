import { Request } from 'express';
import multer from 'multer';

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  if (
    file.mimetype === 'u/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});