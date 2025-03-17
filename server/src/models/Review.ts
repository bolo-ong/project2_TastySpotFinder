import { Schema, model, Types } from "mongoose";
import { updateReviewCount } from "../middlewares";

interface ReviewType {
  _id?: Types.ObjectId;
  writer: Types.ObjectId;
  restaurant?: Types.ObjectId;
  restaurantList?: Types.ObjectId;
  content: string;
  like?: Types.ObjectId[];
  reportedBy?: { userId: Types.ObjectId; reportedAt: Date }[];
  isBlinded?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<ReviewType>(
  {
    writer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    restaurantList: { type: Schema.Types.ObjectId, ref: "RestaurantList" },
    content: { type: String, required: true },
    like: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

reviewSchema.post("save", async function (doc) {
  if (doc.createdAt === doc.updatedAt) {
    await updateReviewCount(doc, 1);
  }
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateReviewCount(doc, -1);
  }
});

const Review = model<ReviewType>("Review", reviewSchema);

export { Review, ReviewType };
