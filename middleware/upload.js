// middleware/upload.js

const multer = require('multer');
const path = require('path');

// Set up storage engine for Multer
const storage = multer.diskStorage({
    // The destination folder for the uploaded files
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this 'uploads' directory exists
    },
    // The filename for the uploaded files
    filename: (req, file, cb) => {
        // Create a unique filename: fieldname-timestamp.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only accept image files
const fileFilter = (req, file, cb) => {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true); // Accept the file
    } else {
        cb(new Error('Error: Images Only!'), false); // Reject the file
    }
};

// Initialize multer with the storage engine and file filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Optional: Limit file size to 5MB
    fileFilter: fileFilter
});

module.exports = upload;