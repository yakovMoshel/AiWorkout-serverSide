import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { updateProfile } from '../api/controller/profileController';
import { fileFilter, storage } from '../api/utils/fileFilter';
import { profileEditValidation } from '../api/validations';
import { validationResult } from 'express-validator';

const router = express.Router();

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function validate(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  next();
}

router.put('/edit', authenticate, upload.single('image'), profileEditValidation, validate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateProfile(req, res);
  } catch (err) {
    next(err);
  }
});

export default router;
