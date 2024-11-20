export interface CognitoToken {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  sub: string;
}

export interface UserInfoFromToken {
  sub: string;
  email: string;
  [key: string]: any;
}
