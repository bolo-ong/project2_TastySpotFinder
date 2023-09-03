import passport from "passport";
import express from "express";

const authRouter = express.Router();

const CALLBACK_URL: string =
  process.env.CALLBACK_URL || "http://localhost:8080/oauth";

authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get(
  "/kakao/oauth",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

export default authRouter;
