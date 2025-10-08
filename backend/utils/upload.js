import multer from "multer";
import imagekit from "../config/imagekit.js";

// Use in-memory storage instead of writing to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (/image|video/.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and videos allowed"), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// Function to upload a file buffer to ImageKit
export const uploadToImageKit = async (file) => {
  try {
    const uploadResponse = await imagekit.upload({
      file: file.buffer.toString("base64"), // Convert buffer to base64
      fileName: file.originalname,
      folder: "uploads", // optional folder name in ImageKit
    });
    return uploadResponse.url; // Return the hosted URL
  } catch (err) {
    console.error("ImageKit Upload Error:", err);
    throw new Error("Failed to upload to ImageKit");
  }
};

export default upload;
