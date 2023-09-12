import passport from "passport";
import { kakaoStrategy } from "./kakaoStrategy";
import { User, UserType } from "../models/User";

passport.serializeUser(
  (user: UserType, done: (err: Error | null, userId: string) => void) => {
    // console.log("serialize", user);
    done(null, user.userId);
  }
);

passport.deserializeUser(
  (user: string, done: (err: Error | null, user: UserType | null) => void) => {
    User.findOne({ userId: user })
      .then((user: UserType | null) => {
        done(null, user);
        console.log("deserialize", user);
      })
      .catch((err) => {
        done(err, null);
      });
  }
);

passport.use("kakao", kakaoStrategy);

export default passport;
