import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../configs/s3.config";
import { Readable } from "stream";

const bucketName = "your-s3-bucket-name";

export const uploadToS3 = async (
  fileBuffer: Buffer | Readable,
  key: string,
  contentType: string
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read"
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.${s3Client.config.region}.amazonaws.com/${key}`;
};
