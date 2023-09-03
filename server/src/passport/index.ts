import passport from "passport";
import { kakaoStrategy } from "./kakaoStrategy";
import { User, KakaoProfile } from "../models/User";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id: string, done) => {
  User.findOne(
    { userId: id },
    (err: Error | null, user: KakaoProfile | null) => {
      done(err, user);
    }
  );
});

passport.use("kakao", kakaoStrategy);

export default passport;
