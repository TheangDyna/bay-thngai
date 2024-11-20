export interface UserFilter {
  gender?: string;
}

export interface UserSort {
  firstName?: "asc" | "desc";
  lastName?: "asc" | "desc";
  createdAt?: "asc" | "desc";
}

export interface UserGetAllRepo {
  page?: number;
  limit?: number;
  filter?: UserFilter;
  sort?: UserSort;
}

export interface UserCreationRepo {
  sub?: string;
  googleSub?: string;
  email: string;
  role: string;
}

export interface UserUpdateRepo {
  userId: string; // _id, sub, googleSub
  sub?: string;
  googleSub?: string;
  firstName?: string;
  lastName?: string;
  profile?: string;
  gender?: string;
  age?: number;
  role?: string;
}

export interface MongoError extends Error {
  code?: number;
  keyPattern?: { [key: string]: number };
}
