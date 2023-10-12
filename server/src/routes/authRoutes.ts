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

authRouter.get("/kakao", passport.authenticate("kakao"));
authRouter.get(
  "/oauth/kakao",
  passport.authenticate("kakao", { failureRedirect: CLIENT_URL }),
  authenticateUser
);
authRouter.get("/logout/kakao", logOutKakao);
authRouter.get("/logout/kakao/callback", logOutUser);

authRouter.get("/google", passport.authenticate("google"));
authRouter.get(
  "/oauth/google",
  passport.authenticate("google", { failureRedirect: CLIENT_URL }),
  authenticateUser
);
authRouter.get("/logout/google", logOutUser);

authRouter.get("/user", getUser);

export default authRouter;
