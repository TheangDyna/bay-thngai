import mongoose from "mongoose";

// Define TypeScript interface for User
export interface IUser {
  _id: string;
  sub: string;
  googleSub: string;
  firstName: string;
  lastName: string;
  email: string;
  profile: string;
  gender: string;
  age: number;
  role: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    sub: { type: String },
    googleSub: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    profile: { type: String },
    gender: { type: String },
    age: { type: Number },
    role: { type: String, require: true },
    favorites: { type: [String], default: [] }
  },
  {
    timestamps: true,
    toObject: {
      transform: function (_doc, ret) {
        delete ret.__v;
        ret._id = ret._id.toString();
      }
    }
  }
);

userSchema.index({ email: 1 }, { unique: true });

// Create a Mongoose model
const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
