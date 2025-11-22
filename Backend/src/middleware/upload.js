import multer from "multer";
import path from "path";
import fs from "fs";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Resume uploads
const resumeDir = path.join(process.cwd(), "uploads", "resumes");
ensureDir(resumeDir);

// Chat uploads
const chatDir = path.join(process.cwd(), "uploads", "chat");
ensureDir(chatDir);

// Generic factory
const storageFactory = (baseDir) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, baseDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
      cb(null, `${Date.now()}_${name}${ext}`);
    },
  });

export const uploadResume = multer({
  storage: storageFactory(resumeDir),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    // allow pdf/doc/docx images
    const ok = /pdf|doc|docx|png|jpg|jpeg/.test(
      path.extname(file.originalname).toLowerCase()
    );
    cb(ok ? null : new Error("Invalid resume file type"), ok);
  },
});

export const uploadChatFile = multer({
  storage: storageFactory(chatDir),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});
