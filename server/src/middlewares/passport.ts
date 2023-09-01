import dotenv from "dotenv";
import passport from "passport";
import { Strategy as KakaoStrategy, Profile } from "passport-kakao";
import User from "../models/User";

dotenv.config();
const KAKAO_CLIENT_ID: string | undefined = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET: string | undefined = process.env.KAKAO_CLIENT_SECRET;
const CALLBACK_URL: string =
  process.env.CALLBACK_URL || "http://localhost:8080/oauth";

if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !CALLBACK_URL) {
  throw new Error("Kakao OAuth configuration missing");
}

passport.use(
  new KakaoStrategy(
    {
      clientID: KAKAO_CLIENT_ID,
      clientSecret: KAKAO_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        const existingUser = await User.findOne({ kakaoId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        } else {
          const newUser = new User({
            kakaoId: profile.id,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
