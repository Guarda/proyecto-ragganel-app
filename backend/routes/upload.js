const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/img-consolas')); // Correct path to destination
  },
  filename: function (req, file, cb) {
    // Use the original name and extension
    const originalName = file.originalname;
    const extension = path.extname(originalName); // Get the extension
    const nameWithoutExt = path.basename(originalName, extension); // Get the name without extension

    // Create a unique filename with the original name and a timestamp to avoid collisions
    const uniqueName = `${nameWithoutExt}-${Date.now()}${extension}`;

    cb(null, uniqueName); // Pass the new filename to the callback
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  // Respond with a JSON message after successful upload
  res.status(200).json({ 
    message: `File uploaded: ${req.file.path}`,
    filename: req.file.filename // NOMBRE DEL ARCHIVO
  });
});

module.exports = router;