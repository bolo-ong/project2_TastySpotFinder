import dotenv from "dotenv";
import passport from "passport";
import express from "express";

const authRouter = express.Router();

dotenv.config();
const CALLBACK_URL: string =
  process.env.CALLBACK_URL || "http://localhost:8080/oauth";

authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get(CALLBACK_URL, passport.authenticate("kakao"));

export default authRouter;
