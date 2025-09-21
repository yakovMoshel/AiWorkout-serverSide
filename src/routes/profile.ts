import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { updateProfile } from '../api/controller/profileController';
import { fileFilter, storage } from '../api/utils/fileFilter';

const router = express.Router();


const upload = multer({ storage : storage, fileFilter : fileFilter });

router.put('/edit', authenticate, upload.single('image'), async (req, res, next) => {
  console.log("REQ FILE:", req.file); // הדפסה
  try {
    await updateProfile(req, res);
  } catch (err) {
    next(err);
  }
});
export default router;
