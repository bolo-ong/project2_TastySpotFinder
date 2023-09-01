// User.ts
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    kakao: {
      kakaoId: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
