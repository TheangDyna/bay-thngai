import { CookieOptions, Response } from "express";
import { config } from "../configs/config";
import { CognitoToken } from "../types/auth.types";

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

export const setAuthCookies = (res: Response, cognitoToken: CognitoToken) => {
  setCookie(res, "id_token", cognitoToken.idToken);
  setCookie(res, "access_token", cognitoToken.accessToken);
  setCookie(res, "refresh_token", cognitoToken.refreshToken, {
    maxAge: 30 * 24 * 3600 * 1000 // 30 days
  });
  setCookie(res, "username", cognitoToken.username, {
    maxAge: 30 * 24 * 3600 * 1000 // 30 days
  });
};

const clearCookie = (res: Response, name: string) => {
  res.cookie(name, "", {
    expires: new Date(0),
    httpOnly: true
  });
};

export const clearAllCookies = (
  res: Response,
  cookies: Record<string, string>
): void => {
  const clearCookies = [
    "id_token",
    "access_token",
    "refresh_token",
    "username"
  ];
  clearCookies.forEach((cookie) => {
    if (cookies[cookie]) {
      clearCookie(res, cookie);
    }
  });
};
