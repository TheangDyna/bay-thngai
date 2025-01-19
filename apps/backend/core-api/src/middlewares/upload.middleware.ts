import multer from "multer";
import { uploadToS3 } from "../utils/uploadToS3";
import { NextFunction, Request, Response } from "express";
import { generateFileUniqueName } from "../utils/generateFileUniqueName";
import { processImage } from "../utils/processImage";

export interface MulterRequest extends Request {
  files?: {
    thumbnail?: Express.Multer.File[];
    images?: Express.Multer.File[];
  };
  s3UploadedFiles: Record<string, string>[];
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const processThumbnailAndImages = async (
  req: MulterRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  req.s3UploadedFiles = [];
  try {
    if (req.files?.thumbnail && req.files.thumbnail.length > 0) {
      const thumbnailFile = req.files.thumbnail[0];
      const thumbnailKey = `thumbnails/${generateFileUniqueName()}.webp`;
      const thumbnailBuffer = await processImage(
        thumbnailFile.buffer,
        300,
        300,
        "webp",
        80
      );

      req.s3UploadedFiles.push({ Key: thumbnailKey });
      const thumbnailUrl = await uploadToS3(
        thumbnailBuffer,
        thumbnailKey,
        "image/webp"
      );

      req.body.thumbnail = thumbnailUrl;
    }

    if (req.files?.images && req.files.images.length > 0) {
      const images = req.files.images;
      const imageUploads = await Promise.all(
        images.map(async (image: Express.Multer.File) => {
          const imageKey = `images/${generateFileUniqueName()}.webp`;
          const imageBuffer = await processImage(
            image.buffer,
            800,
            800,
            "webp",
            80
          );
          req.s3UploadedFiles.push({ Key: imageKey });
          return uploadToS3(imageBuffer, imageKey, "image/webp");
        })
      );

      req.body.images = imageUploads;
    }

    next();
  } catch (error) {
    next(error);
  }
};
