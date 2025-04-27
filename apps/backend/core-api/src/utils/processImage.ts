import sharp from "sharp";

export const processImage = async (
  buffer: Buffer,
  width: number,
  height: number,
  format: "webp" | "avif",
  quality: number
): Promise<Buffer> => {
  return sharp(buffer)
    .resize(width, height, { fit: "inside" })
    .toFormat(format, { quality })
    .toBuffer();
};
