import { Schema, model, Document } from "mongoose";

interface UserType {
  provider: string;
  userId: string;
  displayName: string;
  profile_image: string;
}

const userSchema = new Schema<UserType>(
  {
    provider: String,
    userId: String,
    displayName: String,
    profile_image: String,
  },
  {
    timestamps: true,
  }
);

const UserModel = model<UserType & Document>("User", userSchema);

export { UserModel as User, UserType };
