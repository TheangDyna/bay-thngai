import { IUser } from "@/src/database/models/user.model";
import { PaginationResponse } from "./common.interface";

export interface UserGetAllController {
  page?: number;
  limit?: number;
  filter?: string;
  sort?: string;
}

export interface UserProfileResponse {
  message: string;
  data: IUser;
}

export interface UsersPaginatedResponse {
  message: string;
  data: PaginationResponse<IUser>;
}

export interface UserCreationRequest {
  _id: string;
  sub?: string;
  googleSub?: string;
  email: string;
  role: string;
}

export interface UserUpdateRequest {
  sub?: string;
  googleSub?: string;
  firstName?: string;
  lastName?: string;
  profile?: string;
  gender?: string;
  age?: number;
  role?: string;
}
