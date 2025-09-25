// utils/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "public", "uploads")),
  filename: (req, file, cb) => {
    const safe = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safe);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Archivo no es una imagen"), false);
  cb(null, true);
};

export default multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
