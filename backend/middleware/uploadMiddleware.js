const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../public/img-consolas'); // Adjust this path
    fs.mkdirSync(dir, { recursive: true }); // Create the directory if it doesn't exist
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    res.status(200).send(`File uploaded: ${req.file.filename}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
});

module.exports = router;
