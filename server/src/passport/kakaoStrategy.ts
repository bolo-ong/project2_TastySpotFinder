import {
  Strategy as KakaoStrategy,
  Profile as KakaoProfile,
} from "passport-kakao";
import { User } from "../models/User";

const KAKAO_CLIENT_ID: string | undefined = process.env.KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET: string | undefined = process.env.KAKAO_CLIENT_SECRET;
const KAKAO_LOGIN_REDIRECT_URI: string =
  process.env.KAKAO_LOGIN_REDIRECT_URI ||
  "http://localhost:8080/api/auth/oauth/kakao";

if (!KAKAO_CLIENT_ID || !KAKAO_CLIENT_SECRET || !KAKAO_LOGIN_REDIRECT_URI) {
  throw new Error("Kakao OAuth configuration missing");
}

export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: KAKAO_CLIENT_ID,
    clientSecret: KAKAO_CLIENT_SECRET,
    callbackURL: KAKAO_LOGIN_REDIRECT_URI,
  },
  async (accessToken, refreshToken, profile: KakaoProfile, done) => {
    /*
     * 카카오 프로필사진이 기본 프로필일 경우, 해당 URL은 404응답을 해주기 때문에,
     * 기본 프로필인지 확인 후 DB에 저장하고, 기본 프로필인 경우 프론트에서 처리
     */

    const rawObject = JSON.parse(profile._raw);
    const isDefaultImage: boolean =
      rawObject?.kakao_account?.profile?.is_default_image;

    try {
      const existingUser = await User.findOne({ userId: profile.id });
      if (existingUser) {
        const updatedFields: Record<string, string> = {
          displayName: profile.displayName,
        };

        // 카카오 프로필이 기본이미지가 아닐때만 저장
        if (!isDefaultImage) {
          updatedFields.profile_image = profile._json.properties.profile_image;
        }

        const updatedUser = await User.findOneAndUpdate(
          { userId: profile.id },
          { $set: updatedFields },
          { new: true }
        );

        return done(null, updatedUser);
      } else {
        const newUserFields: Record<string, string> = {
          provider: "kakao",
          userId: profile.id,
          displayName: profile.displayName,
        };

        // 카카오 프로필이 기본이미지가 아닐때만 저장
        if (!isDefaultImage) {
          newUserFields.profile_image = profile._json.properties.profile_image;
        }

        const newUser = new User(newUserFields);
        await newUser.save();
        return done(null, newUser);
      }
    } catch (error) {
      return done(error as Error);
    }
  }
);
