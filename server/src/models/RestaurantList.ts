import { Schema, model } from "mongoose";

interface RestaurantListType {
  title: string;
  description?: string;
  like: number;
  comments: Comment[];
}

const restaurantListSchema = new Schema<RestaurantListType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    like: { type: Number, default: 0 },

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

const RestaurantList = model<RestaurantListType>(
  "RestaurantList",
  restaurantListSchema
);

export { RestaurantList, RestaurantListType };
