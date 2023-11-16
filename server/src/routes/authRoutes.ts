import express from "express";
import passport from "passport";
import {
  authenticateUser,
  logOutUser,
  logOutKakao,
  getUser,
} from "../controllers/authController";

const authRouter = express.Router();
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

//유저 데이터 조회
authRouter.get("/user", getUser);

//kakao
authRouter.get(
  "/kakao",
  passport.authenticate("kakao", { failureRedirect: CLIENT_URL })
);
authRouter.get(
  "/oauth/kakao",
  passport.authenticate("kakao", { failureRedirect: CLIENT_URL }),
  authenticateUser
);
authRouter.get("/logout/kakao/callback", logOutKakao);

//google
authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/oauth/google",
  passport.authenticate("google", { failureRedirect: CLIENT_URL }),
  authenticateUser
);
authRouter.get("/logout/google", logOutUser);

export default authRouter;
