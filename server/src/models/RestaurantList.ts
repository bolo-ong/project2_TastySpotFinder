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
  reviewCount?: number;
  reportedBy?: { userId: Types.ObjectId; reportedAt: Date }[];

  isBlinded?: boolean;
}

const restaurantListSchema = new Schema<RestaurantListType>(
  {
    title: { type: String, required: true },
    description: { type: String },
    thumbnail: [{ type: String }],
    crawlURL: { type: String },
    like: { type: Number, default: 0 }, // 받은 좋아요 수
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }], // 이 리스트에 포함된 식당들
    reviewCount: { type: Number, default: 0 }, // 받은 리뷰 수
    reportedBy: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        reportedAt: { type: Date },
      },
    ],
    isBlinded: { type: Boolean, default: false },
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
