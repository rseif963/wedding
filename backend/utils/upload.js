import multer from "multer";
import imagekit from "../config/imagekit.js";
import crypto from "crypto";
import path from "path";

// In-memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (/^(image|video)\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Upload buffer to ImageKit safely
export const uploadToImageKit = async (file, folder = "vendor_uploads") => {
  if (!file?.buffer) {
    throw new Error("No file buffer provided");
  }

  const mimeToExt = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/heic": ".heic",
    "video/mp4": ".mp4",
  };

  const ext =
    mimeToExt[file.mimetype] ||
    path.extname(file.originalname) ||
    ".bin";

  const finalFileName = `${crypto.randomUUID()}${ext}`;

  const uploadResponse = await imagekit.upload({
    file: file.buffer.toString("base64"),
    fileName: finalFileName,
    folder,
    mimeType: file.mimetype,   // 🔥 THIS LINE FIXES IT
    useUniqueFileName: false,
  });

  if (!uploadResponse?.url || !uploadResponse?.filePath) {
    throw new Error("Invalid ImageKit response");
  }

  return {
    url: uploadResponse.url,
    filePath: uploadResponse.filePath,
    fileId: uploadResponse.fileId,
  };
};


export default upload;
