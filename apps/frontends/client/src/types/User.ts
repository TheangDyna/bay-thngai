export interface User {
  _id: string;
  email: string;
  cognitoId: string;
  role: "admin" | "user";
  activityLevel:
    | "sedentary"
    | "lightly active"
    | "moderately active"
    | "very active";
  dietaryPreferences: string[];
  healthGoals: "maintenance" | "weight loss" | "weight gain";
  allergies: string[];
  dailyCalorieTarget: number;
  createdAt: string;
  updatedAt: string;
}
