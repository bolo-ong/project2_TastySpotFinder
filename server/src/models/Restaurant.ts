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
  comments?: Comment[];
  restaurantLists?: Types.ObjectId[];
}

const restaurantSchema = new Schema<RestaurantType>(
  {
    name: { type: String, required: true, unique: true, index: true },
    category: { type: String },
    location: { type: String },
    contact: { type: String },
    menu: [{ type: String }],
    img: [{ type: String }],
    count: { type: Number, default: 1 },
    like: { type: Number, default: 0 },
    restaurantLists: [{ type: Schema.Types.ObjectId, ref: "RestaurantList" }],

    comments: [
      {
        user: { type: String },
        text: { type: String },
      },
      {
        timestamps: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Restaurant = model<RestaurantType>("Restaurant", restaurantSchema);

export { Restaurant, RestaurantType };
