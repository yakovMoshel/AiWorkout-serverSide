import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { updateProfile } from '../api/controller/profileController';
import { fileFilter, storage } from '../api/utils/fileFilter';

const router = express.Router();


const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

router.put('/edit', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    await updateProfile(req, res);
  } catch (err) {
    next(err);
  }
});
export default router;
