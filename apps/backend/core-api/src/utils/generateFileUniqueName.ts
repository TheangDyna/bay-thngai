import crypto from "crypto";

export const generateFileUniqueName = (originalName: string): string => {
  const extension = originalName.split(".").pop();
  const uniqueHash = crypto.randomBytes(16).toString("hex");
  return `${uniqueHash}.${extension}`;
};
