import multer from "multer";
import sharp from "sharp";
import { uploadToS3 } from "../utils/uploadToS3";
import { NextFunction, Request, Response } from "express";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const processImagesAndThumbnail = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!(req.files as any).thumbnail || !(req.files as any).images) {
      return next();
    }

    // Handle thumbnail
    const thumbnailFile = (req.files as any).thumbnail[0];
    const thumbnailKey = `thumbnails/${Date.now()}-${thumbnailFile.originalname}`;
    const thumbnailBuffer = await sharp(thumbnailFile.buffer)
      .resize(150, 150)
      .toBuffer();
    const thumbnailUrl = await uploadToS3(
      thumbnailBuffer,
      thumbnailKey,
      thumbnailFile.mimetype
    );

    // Handle images (multiple uploads)
    const images = (req.files as any).images;
    const imageUploads = await Promise.all(
      images.map(async (image: Express.Multer.File) => {
        const imageKey = `images/${Date.now()}-${image.originalname}`;
        return await uploadToS3(image.buffer, imageKey, image.mimetype);
      })
    );

    req.body.thumbnail = thumbnailUrl;
    req.body.images = imageUploads;

    next();
  } catch (error) {
    next(error);
  }
};
