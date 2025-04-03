import multer from 'multer';
import path from 'path';

// Set up multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder where uploaded files will be stored
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname); // Get the file extension
        const filename = `${Date.now()}${fileExt}`; // Generate a unique filename based on current timestamp
        cb(null, filename); // Set the file's name in the uploads folder
    }
});

// Set up multer's file size limit (Optional, e.g., 10MB)
const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB limit
});

// Export the middleware to use in your routes
export const uploadSingle = upload.single('image'); // 'image' is the key in form-data for uploading a file
