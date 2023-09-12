import {
  Strategy as KakaoStrategy,
  Profile as KakaoProfile,
} from "passport-kakao";
import { User } from "../models/User";

const KAKAO_CLIENT_ID: string | undefined = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET: string | undefined = process.env.KAKAO_CLIENT_SECRET;
const LOGIN_REDIRECT_URI: string =
  process.env.LOGIN_REDIRECT_URI || "http://localhost:8080/oauth";

if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !LOGIN_REDIRECT_URI) {
  throw new Error("Kakao OAuth configuration missing");
}

export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: KAKAO_CLIENT_ID,
    clientSecret: KAKAO_CLIENT_SECRET,
    callbackURL: LOGIN_REDIRECT_URI,
  },
  async (accessToken, refreshToken, profile: KakaoProfile, done) => {
    try {
      const existingUser = await User.findOne({ userId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = new User({
          provider: "kakao",
          userId: profile.id,
          displayName: profile.displayName,
          profile_image: profile._json.properties.profile_image,
        });
        await newUser.save();
        return done(null, newUser);
      }
    } catch (error) {
      return done(error);
    }
  }
);
