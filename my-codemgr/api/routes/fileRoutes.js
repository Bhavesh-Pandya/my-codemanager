import { Router } from 'express';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
  getAllFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile,
  upload,
  getFileDownload // <--- We'll implement this
} from '../controllers/fileController.js';

const router = Router();

router.get('/files', authenticate, getAllFiles);
router.get('/files/:filename', authenticate, getFile);

// NEW Download Route
router.get('/files/:filename/download', authenticate, getFileDownload);

router.post('/files', authenticate, authorizeAdmin, upload, createFile);
router.put('/files/:filename', authenticate, authorizeAdmin, updateFile);
router.delete('/files/:filename', authenticate, authorizeAdmin, deleteFile);

export default router;
