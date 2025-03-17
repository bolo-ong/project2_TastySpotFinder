import { Schema, model, Types } from "mongoose";

interface RestaurantType {
  _id?: Types.ObjectId;
  name: string;
  category: string;
  location: string;
  contact: string;
  menu: string[];
  img: string[];
  count?: number;
  like?: number;
  reviewCount?: number;
  locationCoordinates?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  naverPlaceId?: string;
}

const restaurantSchema = new Schema<RestaurantType>(
  {
    name: { type: String, required: true, index: true },
    category: { type: String },
    location: { type: String },
    contact: { type: String },
    menu: [{ type: String }],
    img: [{ type: String }],
    count: { type: Number, default: 1 }, // 사람들이 공유한 횟수
    like: { type: Number, default: 0 }, // 받은 좋아요 수
    reviewCount: { type: Number, default: 0 }, // 받은 리뷰 수
    locationCoordinates: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    naverPlaceId: { type: String },
  },
  {
    timestamps: true,
  }
);

restaurantSchema.index({ locationCoordinates: "2dsphere" });

const Restaurant = model<RestaurantType>("Restaurant", restaurantSchema);

export { Restaurant, RestaurantType };
