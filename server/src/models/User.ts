import { Schema, model, Types } from "mongoose";

interface UserType {
  _id: Types.ObjectId;
  provider: string;
  userId: string;
  displayName: string;
  profile_image?: string;
  savedRestaurantLists: Types.ObjectId[];
  savedRestaurants: Types.ObjectId[];
  reviewCount?: number;
  receivedLikes?: number;
  role?: "admin" | "moderator" | "user";
  reportedBy?: {
    userId: Types.ObjectId;
    reportedAt: Date;
  }[];
  ban?: {
    reason?: string;
    bannedAt?: Date;
    banLiftAt?: Date;
  };
  recommendedRestaurantListsCount?: number;
  recommendedRestaurantsCount?: number;
}

const userSchema = new Schema<UserType>(
  {
    provider: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    profile_image: { type: String },
    savedRestaurantLists: [
      { type: Schema.Types.ObjectId, ref: "RestaurantList" },
    ],
    savedRestaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
    reviewCount: { type: Number, default: 0 },
    receivedLikes: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    reportedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        reportedAt: { type: Date },
      },
    ],
    ban: {
      reason: { type: String },
      bannedAt: { type: Date },
      banLiftAt: { type: Date },
    },
    recommendedRestaurantListsCount: { type: Number, default: 0 },
    recommendedRestaurantsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = model<UserType>("User", userSchema);

export { User, UserType };
