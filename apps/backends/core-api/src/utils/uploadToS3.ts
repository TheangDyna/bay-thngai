import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../configs/s3.config";
import { Readable } from "stream";
import { config } from "../configs/config";

export const uploadToS3 = async (
  fileBuffer: Buffer | Readable,
  key: string,
  contentType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: config.awsS3BucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType
  });

  await s3Client.send(command);

  return `https://${config.awsS3BucketName}.s3.${config.awsRegion}.amazonaws.com/${key}`;
};
