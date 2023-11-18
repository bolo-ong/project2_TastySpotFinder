import { Schema, model, Types } from "mongoose";

interface RestaurantListType {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  like: number;
  comments: Comment[];
  writer: Types.ObjectId;
}

const restaurantListSchema = new Schema<RestaurantListType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    like: { type: Number, default: 0 },
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

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
