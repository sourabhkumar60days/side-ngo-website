import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  folderPath: string[]
): Promise<{ url: string; publicId: string }> {
  const folder = folderPath.map(sanitizeSegment).join("/");

  const publicId = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 80);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
        fetch_format: "auto",
        quality: "auto",
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(new Error(error.message));
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export function extractPublicId(url: string): string | null {
  try {
    if (!url || !url.includes("cloudinary.com")) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export function extractPublicIds(commaSeparatedUrls: string): string[] {
  return commaSeparatedUrls
    .split(",")
    .map(u => u.trim())
    .filter(Boolean)
    .map(extractPublicId)
    .filter((id): id is string => id !== null);
}

export async function deleteCloudinaryImages(urls: string | string[]): Promise<void> {
  const urlList = Array.isArray(urls) ? urls : urls.split(",").map(u => u.trim()).filter(Boolean);
  const publicIds = urlList.map(extractPublicId).filter((id): id is string => id !== null);

  for (const publicId of publicIds) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (err) {
      console.error(`[Cloudinary] Failed to delete ${publicId}:`, err);
    }
  }
}

function sanitizeSegment(segment: string): string {
  return segment.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
}
