const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = './uploads';
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  }
});

// Image processing middleware
const processImage = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  try {
    const files = req.files || [req.file];
    const processedFiles = [];

    for (const file of files) {
      if (file) {
        const outputPath = `./uploads/processed-${file.filename}`;
        
        await sharp(file.path)
          .resize(800, 600, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toFile(outputPath);

        // Delete original file
        await fs.unlink(file.path);
        
        processedFiles.push({
          ...file,
          path: outputPath,
          filename: `processed-${file.filename}`
        });
      }
    }

    if (req.files) {
      req.files = processedFiles;
    } else {
      req.file = processedFiles[0];
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processImage };