import express from 'express';
import multer from 'multer';
import path from 'path';
import { processImage } from '../utils/imageProcessor';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .jpg format allowed!'));
    }
  },
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }
  res.json({ filename: req.file.filename });
});

router.get('/resize', async (req, res) => {
  const { filename, width, height } = req.query;
  if (!filename || !width || !height) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const numWidth = parseInt(width as string);
  const numHeight = parseInt(height as string);

  if (isNaN(numWidth) || isNaN(numHeight) || numWidth <= 0 || numHeight <= 0) {
    return res.status(400).json({ error: 'Invalid width or height' });
  }

  try {
    console.log('filename', filename);
    const resizedImagePath = await processImage(filename as string, numWidth, numHeight);
    res.sendFile(resizedImagePath);
  } catch (error) {
    res.status(500).json({ error: 'Error processing image' });
  }
});

export { router as imageRoutes };
