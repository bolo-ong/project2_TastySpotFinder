import passport from "passport";
import { kakaoStrategy } from "./kakaoStrategy";
import { User, UserType } from "../models/User";

passport.serializeUser(
  (user: UserType, done: (err: Error | null, id?: string) => void) => {
    done(null, user.userId);
  }
);

passport.deserializeUser(
  (userId: string, done: (err: Error | null, user?: UserType) => void) => {
    User.findOne({ userId: userId }, (err: Error | null, user?: UserType) => {
      done(err, user);
    });
  }
);

passport.use("kakao", kakaoStrategy);

export default passport;
