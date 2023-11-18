import { Schema, model, Types } from "mongoose";

interface UserType {
  _id?: Types.ObjectId;
  provider: string;
  userId: string;
  displayName: string;
  profile_image: string;
}

const userSchema = new Schema<UserType>(
  {
    provider: { type: String },
    userId: { type: String },
    displayName: { type: String },
    profile_image: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model<UserType>("User", userSchema);

export { User, UserType };
