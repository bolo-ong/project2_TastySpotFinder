import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    provider: String,
    id: String,
    displayName: String,
    profile_image: String,
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export { User };
