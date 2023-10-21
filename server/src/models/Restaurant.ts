import { Schema, model } from "mongoose";

interface RestaurantType {
  name: string;
  category: string;
  location: string;
  contact: string;
  menu: string[];
  img: string[];
  count?: number;
}

const restaurantSchema = new Schema<RestaurantType>({
  name: { type: String, required: true, unique: true, index: true },
  category: { type: String },
  location: { type: String },
  contact: { type: String },
  menu: [{ type: String }],
  img: [{ type: String }],
  count: { type: Number, default: 1 },
});

const Restaurant = model<RestaurantType>("Restaurant", restaurantSchema);

export { Restaurant, RestaurantType };
