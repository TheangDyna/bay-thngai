import { PaginationResponse } from "./common.interface";

export interface UserGetAllControllerParams {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

export interface IUser {
  _id?: string;
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  profile?: string;
  gender?: string;
  age?: number;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfileResponse {
  message: string;
  data: IUser;
}

export interface UsersPaginatedResponse {
  message: string;
  data: PaginationResponse<IUser>;
}

export interface UserCreationRequestParams {
  sub?: string;
  googleSub?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserUpdateRequestParams {
  sub?: string;
  googleSub?: string;
  facebookSub?: string;
  username?: string;
  profile?: string;
  gender?: string;
  age?: number;
  role?: string;
}
