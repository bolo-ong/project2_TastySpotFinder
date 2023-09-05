import passport, { Profile } from "passport";
import { kakaoStrategy } from "./kakaoStrategy";
import { User } from "../models/User";

interface User extends Express.User {
  provider: string;
  id: string;
  displayName: string;
  profile_image: string;
}

passport.serializeUser(
  (user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, user);
  }
);

passport.deserializeUser((userId: string, done) => {
  User.findOne({ userId: userId }, (err: Error | null, user: User | null) => {
    done(err, user);
  });
});

passport.use("kakao", kakaoStrategy);

export default passport;
