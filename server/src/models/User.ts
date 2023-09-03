// models/User.ts 파일
import { Schema, model } from "mongoose";

interface KakaoProfile {
  userId: string;
  userName: string;
  provider: string;
}

const userSchema = new Schema<KakaoProfile>(
  {
    userId: String,
    userName: String,
    provider: String,
  },
  {
    timestamps: true,
  }
);

const User = model<KakaoProfile>("User", userSchema);

export { User, KakaoProfile };
