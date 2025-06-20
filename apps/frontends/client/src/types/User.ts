export interface User {
  _id: string;
  email: string;
  cognitoId: string;
  role: "admin" | "user";
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  dietaryPreferences?: string[];
  healthGoals?: string;
  allergies?: string[];
  dailyCalorieTarget?: number;
  createdAt: string;
  updatedAt: string;
  wishlist: string[];
}
