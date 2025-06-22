import sharp from "sharp";

export const processImage = async (
  buffer: Buffer,
  width: number,
  height: number,
  format: "webp" | "avif",
  quality: number
): Promise<Buffer> => {
  // Validate inputs
  if (!buffer || !Buffer.isBuffer(buffer)) throw new Error("Invalid buffer");
  if (!Number.isInteger(width) || width <= 0) throw new Error("Invalid width");
  if (!Number.isInteger(height) || height <= 0)
    throw new Error("Invalid height");
  if (!Number.isInteger(quality) || quality < 1 || quality > 100)
    throw new Error("Invalid quality");
  if (!["webp", "avif"].includes(format)) throw new Error("Invalid format");

  console.log({ width, height, format, quality, bufferLength: buffer.length }); // Debug

  return sharp(buffer)
    .resize(width, height, { fit: "inside" })
    .toFormat(format, { quality, lossless: false }) // Explicitly set lossless
    .toBuffer();
};
