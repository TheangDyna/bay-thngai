import { jwtDecode } from "jwt-decode";
import { UserInfoFromIdToken } from "../types/auth.types";

export const decodeIdToken = (token: string): UserInfoFromIdToken => {
  try {
    const decodedToken = jwtDecode<UserInfoFromIdToken>(token);
    return decodedToken;
  } catch (error) {
    throw new Error("Failed to decode ID token. Invalid token.");
  }
};
