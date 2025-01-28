import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import File from '../models/File.js';

// Because we're in ES modules, define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure Multer to store uploads locally in "uploads" folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

export const upload = multer({ storage }).single('icon');

export const getAllFiles = async (req, res) => {
  try {
    const files = await File.getAll();
    return res.json(files);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const file = await File.getByName(filename);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    return res.json(file);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createFile = async (req, res) => {
  try {
    const { filename, content } = req.body;
    const iconUrl = req.file
      ? `/api/uploads/${req.file.filename}`
      : '/api/uploads/default-icon.png'; // Provide a default or fallback

    await File.create(filename, content, iconUrl);
    return res.status(201).json({ message: 'File created' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { filename } = req.params;
    const { content } = req.body;
    await File.update(filename, content);
    return res.json({ message: 'File updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    await File.delete(filename);
    return res.json({ message: 'File deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const getFileDownload = async (req, res) => {
  try {
    const { filename } = req.params;
    const file = await File.getByName(filename);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    // Force the browser to download as <filename>.txt
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.txt"`);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    // Send the file content as text
    return res.send(file.content);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
