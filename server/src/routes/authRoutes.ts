import passport, { session } from "passport";
import express from "express";

const authRouter = express.Router();

const CLIENT_URL: string = process.env.CLIENT_URL || "http://localhost:3000";

authRouter.get("/kakao", passport.authenticate("kakao"));

authRouter.get(
  "/kakao/oauth",
  passport.authenticate("kakao", {
    failureRedirect: CLIENT_URL,
  }),
  (req, res) => {
    res.redirect(CLIENT_URL);
  }
);

const KAKAO_LOGOUT_URL = `https://kauth.kakao.com/oauth/logout?client_id=${process.env.KAKAO_CLIENT_ID}&logout_redirect_uri=${CLIENT_URL}`;
authRouter.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log("logout", err);
      }
      req.session.save(() => {
        res.redirect(KAKAO_LOGOUT_URL);
      });
    });
  }
});

authRouter.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  }
});

export default authRouter;
