import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the upload directory exists
const ensureDirectoryExists = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Define the storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "public", "brands");
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize the original filename
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    );
    // creating new filename
    cb(null, `${file.fieldname}_${Date.now()}_${sanitizedOriginalName}`);
  },
});

// Create multer instance
export const upload = multer({ storage: storage }).single("logo");

// ---------------------------------------------------------------------------------

// Define the storage configuration
const product_storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "..", "public", "products");
    ensureDirectoryExists(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize the original filename
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.]/g,
      "_"
    );
    // creating new filename
    cb(null, `${file.fieldname}_${Date.now()}_${sanitizedOriginalName}`);
  },
});

// Create multer instance
export const upload_prodcuct = multer({
  storage: product_storage, // Your storage configuration
}).any();
