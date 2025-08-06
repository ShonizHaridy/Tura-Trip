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

// Helper function to process a single file
const processSingleFile = async (file) => {
  const nameWithoutExt = path.parse(file.filename).name;
  const outputFilename = `processed-${nameWithoutExt}.jpg`;
  const outputPath = `./uploads/${outputFilename}`;
  
  try {
    await sharp(file.path)
      .resize(800, 600, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Delete original file after successful processing
    await fs.unlink(file.path);
    
    return {
      ...file,
      path: outputPath,
      filename: outputFilename,
      mimetype: 'image/jpeg'
    };
  } catch (sharpError) {
    console.error('Image processing failed for', file.filename, ':', sharpError);
    // Return original file if processing fails
    return file;
  }
};

// Fixed image processing middleware
const processImage = async (req, res, next) => {
  if (!req.files && !req.file) return next();

  try {
    // Handle single file upload (req.file)
    if (req.file) {
      req.file = await processSingleFile(req.file);
      return next();
    }

    // Handle multiple field uploads (req.files) 
    if (req.files) {
      const processedFiles = {};
      
      // Process each field (coverImage, tourImages, etc.)
      for (const [fieldName, fileArray] of Object.entries(req.files)) {
        processedFiles[fieldName] = [];
        
        // Process each file in the field
        for (const file of fileArray) {
          const processedFile = await processSingleFile(file);
          processedFiles[fieldName].push(processedFile);
        }
      }
      
      req.files = processedFiles;
    }

    next();
  } catch (error) {
    console.error('Image processing middleware error:', error);
    next(error);
  }
};

module.exports = { upload, processImage };