import { Schema, model, Document } from "mongoose";

interface RestaurantType extends Document {
  name: string;
  count: number;
  category: string;
  location: string;
  contact: string;
  menu: string[];
  img: string[];
}

const restaurantSchema = new Schema<RestaurantType>({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  category: { type: String },
  location: { type: String },
  contact: { type: String },
  menu: [{ type: String }],
  img: [{ type: String }],
});

const Restaurant = model<RestaurantType>("Restaurant", restaurantSchema);

export { Restaurant, RestaurantType };
