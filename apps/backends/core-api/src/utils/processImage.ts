import sharp from "sharp";

export const processImage = async (
  buffer: Buffer,
  width: number,
  height: number,
  format: "webp" | "avif",
  quality: number
): Promise<Buffer> => {
  const sharpInstance = sharp(buffer).resize(width, height, { fit: "inside" });

  if (format === "webp") {
    return sharpInstance.webp({ quality }).toBuffer();
  } else if (format === "avif") {
    return sharpInstance.avif({ quality }).toBuffer();
  }

  throw new Error(`Unsupported format: ${format}`);
};
