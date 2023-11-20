import { Schema, model, Types } from "mongoose";

interface UserType {
  _id?: Types.ObjectId;
  provider: string;
  userId: string;
  displayName: string;
  profile_image: string;
  savedRestaurantLists: Types.ObjectId[];
  savedRestaurants: Types.ObjectId[];
}

const userSchema = new Schema<UserType>(
  {
    provider: { type: String },
    userId: { type: String },
    displayName: { type: String },
    profile_image: { type: String },
    savedRestaurantLists: [
      { type: Schema.Types.ObjectId, ref: "RestaurantList" },
    ],
    savedRestaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
  },
  {
    timestamps: true,
  }
);

const User = model<UserType>("User", userSchema);

export { User, UserType };
