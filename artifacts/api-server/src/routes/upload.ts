import { Router, type IRouter } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../cloudinaryService.js";

const router: IRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const { folder } = req.body;
    if (!folder) {
      res.status(400).json({ error: "folder path required" });
      return;
    }

    const folderPath: string[] = JSON.parse(folder);
    if (!Array.isArray(folderPath) || folderPath.length === 0) {
      res.status(400).json({ error: "folder must be a non-empty JSON array" });
      return;
    }

    const { url } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folderPath
    );

    res.json({ url });
  } catch (err: any) {
    req.log.error(err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
