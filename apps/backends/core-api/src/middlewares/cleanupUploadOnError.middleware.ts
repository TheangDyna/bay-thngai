import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextFunction, Response } from "express";
import { config } from "../configs/config";
import { s3Client } from "../configs/s3.config";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";
import { MulterRequest } from "./upload.middleware";

export const cleanupUploadOnError = async (
  err: Error | AppError,
  req: MulterRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.s3UploadedFiles && req.s3UploadedFiles.length > 0) {
      const deletePromises = req.s3UploadedFiles.map(({ Key }) =>
        s3Client.send(
          new DeleteObjectCommand({
            Bucket: config.awsS3BucketName,
            Key
          })
        )
      );

      await Promise.all(deletePromises);
    }
  } catch (cleanupError) {
    // move to globle error
    logger.error("Failed to clean up S3 files:", cleanupError);
  } finally {
    next(err);
  }
};
