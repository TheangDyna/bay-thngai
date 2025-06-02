import crypto from "crypto";

export const generateFileUniqueName = (): string => {
  const uniqueHash = crypto.randomBytes(16).toString("hex");
  return `${uniqueHash}`;
};
