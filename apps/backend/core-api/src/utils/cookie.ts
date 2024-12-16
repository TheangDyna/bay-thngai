import { CookieOptions, Response } from "express";
import { config } from "../configs/config";

const setCookie = (
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" : "lax",
    maxAge: 3600 * 1000 // 60 minutes
  };

  res.cookie(name, value, { ...defaultOptions, ...options });
};

const clearCookie = (res: Response, name: string) => {
  res.cookie(name, "", {
    expires: new Date(0),
    httpOnly: true
  });
};

export { setCookie, clearCookie };
