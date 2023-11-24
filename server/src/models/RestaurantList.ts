import { Schema, model, Types } from "mongoose";

interface RestaurantListType {
  _id?: Types.ObjectId;
  title: string;
  thumbnail?: string[];
  description?: string;
  crawlURL: string;
  like: number;
  writer: Types.ObjectId;
  restaurants?: Types.ObjectId[];
  savedByUsers?: Types.ObjectId[];
  comments?: Comment[];
}

const restaurantListSchema = new Schema<RestaurantListType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: [{ type: String }],
    crawlURL: { type: String },
    like: { type: Number, default: 0 },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
    savedByUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

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
