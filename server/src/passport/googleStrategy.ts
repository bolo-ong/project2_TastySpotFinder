import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import { User } from "../models/User";

const GOOGLE_CLIENT_ID: string | undefined = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET: string | undefined =
  process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_LOGIN_REDIRECT_URI: string =
  process.env.GOOGLE_LOGIN_REDIRECT_URI ||
  "http://localhost:8080/api/auth/oauth/google";

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_LOGIN_REDIRECT_URI) {
  throw new Error("Google OAuth configuration missing");
}

export const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_LOGIN_REDIRECT_URI,
    scope: ["profile"],
    state: true,
  },
  async (accessToken, refreshToken, profile: GoogleProfile, done) => {
    try {
      const existingUser = await User.findOne({ userId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      } else {
        let profile_image = "";
        if (profile.photos && profile.photos.length > 0) {
          profile_image = profile.photos[0].value;
        }
        const newUser = new User({
          provider: "google",
          userId: profile.id,
          displayName: profile.displayName,
          profile_image,
        });
        await newUser.save();
        return done(null, newUser);
      }
    } catch (error) {
      return done(error as Error);
    }
  }
);
